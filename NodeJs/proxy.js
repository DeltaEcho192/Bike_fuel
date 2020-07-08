const express = require("express");
const request = require("request");
const fs = require("fs");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/direc/:start/:end", (req, res) => {
  var fnlurl =
    "https://maps.googleapis.com/maps/api/directions/json?origin=" +
    req.params.start +
    "&destination=" +
    req.params.end +
    "&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
  request({ url: fnlurl }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return res.status(500).json({ type: "error", message: err.message });
    }

    res.json(JSON.parse(body));
  });
});

app.get("/bike/:id", (req, res) => {
  fs.readFile("info.json", (err, data) => {
    if (err) throw err;
    var idBike = req.params.id;
    console.log(idBike);
    let bikes = JSON.parse(data);
    console.log(bikes[idBike]);
    res.json(bikes[idBike]);
  });
});

app.get("/price/:id", (req, res) => {
  fs.readFile("price.json", (err, data) => {
    if (err) throw err;
    var idPrice = req.params.id;
    let price = JSON.parse(data);
    res.json(price[idPrice]);
  });
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
