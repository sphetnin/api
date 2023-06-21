require('dotenv').config()
var express = require("express");
var app = express();
var cors = require('cors')

app.use(cors())
app.data = [];

var fs = require('fs');
fs.readdirSync('./v1').forEach(function (file) {
    if (file[0] == '.') return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./v1/' + routeName)(app); 
});

app.listen(9000, function () {
    console.log('CORS-enabled web server listening on port 9000')
  })