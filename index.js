var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(2016);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    // Website you wish to allow to connect
    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    // // Request methods you wish to allow
    // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // // Request headers you wish to allow
    // response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//allroutes
var allroute=require("./routes/allroute.js");
app.use('/',allroute);
//article