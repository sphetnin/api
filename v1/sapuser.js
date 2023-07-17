require('dotenv').config()
var bodyParser = require('body-parser'); //lib bodyParser
var jsonParser = bodyParser.json() //lib bodyParser

//SAP
// const { PerformanceObserver, performance } = require('perf_hooks');
// var util = require('util');
var hana = require('@sap/hana-client');

var connOptions = {
    //specify the connection parameters
    serverNode: process.env.DB_SAP_HOST,
    UID: process.env.DB_SAP_USER,
    PWD: process.env.DB_SAP_PASSWORD,
    sslValidateCertificate: 'false',
};

var connection = hana.createConnection();
connection.connect(connOptions);

module.exports = function (app) {

    let stml = 'SELECT T0."Code" AS "Employee ID", T0."firstName" AS "NAME_TH", T0."lastName" AS "LNAME_TH", T0."middleName" AS "FULL_ENG", T0."sex", T2."Name" AS "Department", T3."Name" AS "Sub-Department", T1."name" AS "Position", T0."mobile", T0."email" '
    stml += 'FROM BST_TEST.OHEM AS T0 LEFT JOIN BST_TEST.OHPS T1 ON T0."position" = T1."posID" LEFT JOIN BST_TEST.OUDP T2 ON T2."Code" = T0."dept"'
    stml += 'LEFT JOIN BST_TEST.OUBR T3 ON T3."Code" = T0."branch"'
    stml += 'ORDER BY T0."Code"';


    //Get all info user on SAP
    app.get('/sap_user', jsonParser, function (req, res) {
        connection.execute(stml,
            function (err, data) {
                if (err) { res.json({ status: 'error', message: err }); return }
                if (data.length == 0) { res.json({ status: 'error', message: 'No data in users table' }); return }

                res.json({
                    status: 'ok',
                    data: data
                })
            }
        )
    })
}