var express = require('express');
var app = express();

app.get('/test', function (req, res) {
    res.send('Big titty Trippin');
 })
 
 var server = app.listen(4000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })