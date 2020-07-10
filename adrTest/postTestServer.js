var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = 9000;
var arrTest;

app.post("/send", function (req, res) {
  console.log("receiving data ...");
  console.log("body is ", req.body);
  arrTest = req.body;
  console.log(arrTest);
  res.json(JSON.stringify(arrTest))
});

app.get("/return", function (req, res) {
  console.log("Sending results back");
  res.send(arrTest);
});
// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
