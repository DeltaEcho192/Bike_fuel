var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
const bent = require('bent')
const fs = require("fs");
const getJSON = bent('json')
var cors = require('cors')
var app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

var port = 8500
app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/testing", function (req, res) {
    console.log("receiving data ...");
    console.log("body is ", req.body);
    arrTest = req.body;
    res.send(arrTest)
});

app.listen(port);
console.log("Server started! At http://localhost:" + port);
