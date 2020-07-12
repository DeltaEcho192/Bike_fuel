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

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var route = "http://localhost"
var port = 9000;
var arrTest;
var bikeData;

app.post("/send", function (req, res) {
  console.log("receiving data ...");
  console.log("body is ", req.body);
  arrTest = req.body;
  var bike = bikeID(arrTest[arrTest.length - 2])
  var price = priceID(arrTest[arrTest.length - 1])
  console.log(bike)
  var testValues = ["Cape Town, South Africa", "George, South Africa", "Durban, South Africa", "Johannesburg, South Africa", 1, 1]
  var url = adrMaker(arrTest)
  calculations(url[0], bike[0], bike[1], price[1], price[0], bike[2], url[1]).then((value) => res.json(JSON.stringify(value)))
});

function adrMaker(names) {
  //Check if waypoints added
  var waypoints = "&waypoints="
  var startAdr = names[0];
  var strStartAdr = startAdr.split(" ");
  var fnlStartAdr = strStartAdr.join("+");

  var endAdr = names[names.length - 3];
  var strEndAdr = endAdr.split(" ");
  var fnlEndAdr = strEndAdr.join("+");

  for (i = 1; i < names.length - 3; i++) {
    var working = names[i];
    var work1 = working.split(" ");
    var work2 = work1.join("+")
    waypoints = waypoints + work2 + "|";
  }
  var fnlwaypoints = waypoints.slice(0, -1);
  var fnlurl =
    "https://maps.googleapis.com/maps/api/directions/json?origin=" +
    fnlStartAdr +
    "&destination=" +
    fnlEndAdr + fnlwaypoints +
    "&units=metric&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
  var embedUrl = "https://www.google.com/maps/embed/v1/directions?origin=" +
    fnlStartAdr +
    "&destination=" +
    fnlEndAdr + fnlwaypoints +
    " &key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
  return [fnlurl, embedUrl]
}

async function calculations(fnlurl, bikeEff, bikeRange, price, symbol, nameBike, embUrl) {
  var distTotal = []
  var timeTotal = []
  var rtnValues = []
  let obj = await getJSON(fnlurl)
  var apiReturn = obj
  console.log(apiReturn.routes[0].legs.length)
  for (i = 0; i < apiReturn.routes[0].legs.length; i++) {
    var distanceVar = apiReturn.routes[0].legs[i].distance.value;
    var time = apiReturn.routes[0].legs[i].duration.value;
    var timeText = apiReturn.routes[0].legs[i].duration.text;

    distTotal.push(distanceVar)
    timeTotal.push(time)
  }

  var distance = distTotal.reduce((a, b) => a + b, 0)

  var totalTime = timeTotal.reduce((a, b) => a + b, 0)

  var fuelUsage = bikeEff * distance;
  var fuelUsage = Math.round(fuelUsage * 100) / 100;

  var fnlCost = fuelUsage * price;
  var fnlCost = Math.round(fnlCost * 100) / 100;


  var amtStops = distance / (bikeRange * 1000);
  if (amtStops < 1) {
    amtStops = Math.floor(amtStops);
  } else {
    amtStops = Math.ceil(amtStops);
  }
  rtnValues.push(distance, totalTime, fuelUsage, fnlCost, amtStops, symbol, nameBike, embUrl)
  return rtnValues
}

function bikeID(bikeId) {
  var bike = fs.readFileSync("info.json", 'utf8');
  bike = JSON.parse(bike);
  bikeData = bike[bikeId]
  fuelEff = bikeData[0].fuel_eff;
  tankSize = bikeData[0].range;
  bikeName = bikeData[0].name;
  return [fuelEff, tankSize, bikeName]
}
function priceID(priceId) {
  var price = fs.readFileSync("price.json", 'utf8');
  price = JSON.parse(price);
  var priceData = price[priceId];
  var symbol = priceData[0].symbol
  var priceFnl = priceData[0].price
  return [symbol, priceFnl]
}

app.get("/return", function (req, res) {
  console.log("Sending results back");
  res.send(arrTest);
});
// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
