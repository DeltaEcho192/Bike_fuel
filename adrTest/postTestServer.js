var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
const bent = require('bent')
const fs = require("fs");

var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var route = "http://localhost"
var port = 9000;
var arrTest;

app.post("/send", function (req, res) {
  console.log("receiving data ...");
  console.log("body is ", req.body);
  arrTest = req.body;
  //All the calculations

  //Read in bike
  //Read in price
  //Do big maths
  console.log(arrTest);
  res.json(JSON.stringify(arrTest))
});

function adrMaker(names) {
  //Check if waypoints added
  var waypoints = "&waypoints="
  var startAdr = names[0];
  var strStartAdr = startAdr.split(" ");
  var fnlStartAdr = strStartAdr.join("+");
  console.log(fnlStartAdr)

  var endAdr = names[names.length - 3];
  console.log(endAdr)
  var strEndAdr = endAdr.split(" ");
  var fnlEndAdr = strEndAdr.join("+");
  console.log(fnlEndAdr)

  for (i = 1; i < names.length - 3; i++) {
    var working = names[i];
    var work1 = working.split(" ");
    var work2 = work1.join("+")
    waypoints = waypoints + work2 + "|";
  }
  var fnlwaypoints = waypoints.slice(0, -1);
  console.log(waypoints)
  var fnlurl =
    "https://maps.googleapis.com/maps/api/directions/json?origin=" +
    fnlStartAdr +
    "&destination=" +
    fnlEndAdr + fnlwaypoints +
    "&units=metric&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
  console.log(fnlurl);
  return fnlurl
}
const getJSON = bent('json')
async function calculations(fnlurl, bikeEff, bikeRange, price) {
  var distTotal = []
  var timeTotal = []
  var rtnValues = []
  let obj = await getJSON(fnlurl)
  console.log(obj.routes[0].legs)
  var apiReturn = obj
  console.log(apiReturn.routes[0].legs.length)
  for (i = 0; i < apiReturn.routes[0].legs.length; i++) {
    var distanceVar = apiReturn.routes[0].legs[i].distance.value;
    var time = apiReturn.routes[0].legs[i].duration.value;
    var timeText = apiReturn.routes[0].legs[i].duration.text;
    console.log(distanceVar)
    console.log(time)
    console.log(timeText)
    distTotal.push(distanceVar)
    timeTotal.push(time)
  }
  console.log(distTotal)
  console.log(timeTotal)
  var distance = distTotal.reduce((a, b) => a + b, 0)
  console.log(distance)
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
  console.log(fuelUsage + " Fuel Usage")
  console.log(fnlCost + " Cost of Petrol")
  console.log(amtStops + " Amount of stops")

  rtnValues.push(distance, totalTime, fuelUsage, fnlCost, amtStops)
  return rtnValues
}

var testValues = ["Cape Town, South Africa", "George, South Africa", "Durban, South Africa", "Johannesburg, South Africa", 1, 1]
var url = adrMaker(testValues)
calculations(url, 0.00006, 270, 13.2).then(console.log)


app.get("/return", function (req, res) {
  console.log("Sending results back");
  res.send(arrTest);
});
// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
