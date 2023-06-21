var bodyParser = require('body-parser'); //lib bodyParser
var jsonParser = bodyParser.json() //lib bodyParser
const mysql = require('mysql2'); // get the client
const bcrypt = require('bcrypt'); //lib bcrypt
const saltRounds = 10; //lib bcrypt

// create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = function (app) {

    app.post('/users/chk', jsonParser, function (req, res) {
        connection.execute('SELECT * FROM users WHERE email=?',
            [req.body.email],
            function (err, users) {
                if (users.length == 0) {
                    res.json({ status: 'ok', message: 'No data in users table' });
                    return
                } else {
                    res.json({ status: 'error', message: 'Email already exist' });
                }
            }
        )
    })

    app.post('/users/register', jsonParser, function (req, res) {

        bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {

            if (req.body.email == "" || req.body.password == "" || req.body.fname == "" || req.body.lname == "") {
                res.json({ status: "error", message: "worng data!" })
            } else {
                connection.execute(
                    'INSERT INTO users (email, password, fname, lname) VALUES (? ,? ,? ,?)',
                    [req.body.email, hashPassword, req.body.fname, req.body.lname],
                    function (err, results) {
                        if (err) {
                            res.json({ status: "err", message: err })
                        } else {
                            res.json({ status: "OK", message: 'Register success!' })
                        }
                    }
                );
            }
        });

    })
}
