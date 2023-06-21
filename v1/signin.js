const mysql = require('mysql2'); // get the client
var bodyParser = require('body-parser'); //lib bodyParser
var jsonParser = bodyParser.json() //lib bodyParser
var jwt = require('jsonwebtoken'); //lib jwt
var secretKey = 'TEST_NODEJS_REST_API'; //lib jwt
const bcrypt = require('bcrypt'); //lib bcrypt

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = function (app) {

    app.get('/signin', jsonParser, function (req, res) {
        connection.execute('SELECT * FROM users',
            function (err, users) {
                if (err) { res.json({ status: 'error', message: err }); return }
                if (users.length == 0) { res.json({ status: 'error', message: 'No data in users table' }); return }

                res.json({
                    status: 'ok',
                    data: users
                })
            }
        )
    })

    app.post('/signin/login', jsonParser, function (req, res) {
        connection.execute('SELECT * FROM users WHERE email=?',
            [req.body.email],
            function (err, users) {
                if (err) { res.json({ status: 'error', message: err }); return }
                if (users.length == 0) { res.json({ status: 'error', message: 'Email not found' }); return }
                bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
                    if (isLogin) {
                        var token = jwt.sign({ email: users[0].email }, secretKey)
                        res.json({ status: 'ok', message: 'Login success', token })
                    } else {
                        res.json({ status: 'error', message: 'Login failed' })
                    }
                });
            }
        );
    })

    app.post('/signin/authen', jsonParser, function (req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];

                jwt.verify(token, secretKey, (err, decode) => {
                    if (err) {
                        res.json({ status: 'error', message: decode })
                    } else {
                        res.json({ status: 'ok', message: decode })
                    }
                });
                res.json({ token })
            } else {
                return res.sendStatus(401);
            }
        } catch (err) {
            res.json({ status: 'err', message: err })
        }
    })
}