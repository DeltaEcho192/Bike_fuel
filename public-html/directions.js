var placeSearch, autocomplete, autocomplete2;
var symbol = "";
var price;
var place = [];
const route = "http://localhost";
const port = ":9000";

var componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

function apiCall() {
  console.log(document.getElementById("rtn").checked);
  var bikeV = document.getElementById("bikeList").value;
  var priceV = document.getElementById("priceList").value;
  fuelGet(priceV);
  var url = encodeURI(adrMaker());
  console.log(url);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      var apireturn = JSON.parse(xmlHttp.responseText);
    var distance = apireturn.routes[0].legs[0].distance.value;
    var distDisplay = apireturn.routes[0].legs[0].distance.text;
    var time = apireturn.routes[0].legs[0].duration.text;
    if (document.getElementById("rtn").checked == true) {
      distance = distance * 2;
      var dispValues = rtn(distDisplay, time);
      document.getElementById("distTbl").innerHTML = dispValues[0];
      document.getElementById("timeTbl").innerHTML = dispValues[1];
    } else {
      document.getElementById("distTbl").innerHTML = distDisplay;
      document.getElementById("timeTbl").innerHTML = time;
    }
    calculations(distance, time, bikeV);
    stopCheck(distance);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function adrMaker() {
  var startAdr = document.getElementById("autocomplete").value;
  var strStartAdr = startAdr.split(" ");
  document.getElementById("startAdTbl").innerHTML = startAdr;
  var fnlStartAdr = strStartAdr.join("+");

  var endAdr = document.getElementById("autocomplete2").value;

  document.getElementById("endAdTbl").innerHTML = endAdr;
  var strEndAdr = endAdr.split(" ");
  var fnlEndAdr = strEndAdr.join("+");
  var url = route + port + "/direc/" + decodeURI(fnlStartAdr) + "/" + fnlEndAdr;
  var ifrm = document.getElementById("mapDisp");
  ifrm.src =
    "https://www.google.com/maps/embed/v1/directions?origin=" +
    fnlStartAdr +
    "&destination=" +
    fnlEndAdr +
    "&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
  return url;
}

function calculations(distance, time, bike) {
  url = route + port + "/bike/" + bike;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      var apireturn = JSON.parse(xmlHttp.responseText);
    document.getElementById("bikeTbl").innerHTML = apireturn[0].name;
    var fuelEff = apireturn[0].fuel_eff;

    var fuelUsage = fuelEff * distance;
    var fuelUsage = Math.round(fuelUsage * 100) / 100;
    document.getElementById("lTbl").innerHTML = fuelUsage + " L";
    var fnlCost = fuelUsage * price;
    var fnlCost = Math.round(fnlCost * 100) / 100;
    document.getElementById("costTbl").innerHTML = symbol + " " + fnlCost;

    var amtStops = distance / (apireturn[0].range * 1000);
    if (amtStops < 1) {
      amtStops = Math.floor(amtStops);
    } else {
      amtStops = Math.ceil(amtStops);
    }
    document.getElementById("stopsTbl").innerHTML = amtStops;
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function fuelGet(id) {
  url = route + port + "/price/" + id;
  console.log(url);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      var priceReturn = JSON.parse(xmlHttp.responseText);
    symbol = String(priceReturn[0].symbol);
    price = priceReturn[0].price;
  };
  xmlHttp.open("GET", url, false);
  xmlHttp.send();
}

function stopCheck(distance) {
  var amtStops = Math.floor(distance / 200000);
  document.getElementById("stopsTbl").innerHTML = amtStops;
}

function rtn(dispDist, time) {
  var distW = dispDist.split(" ");
  var timeW = time.split(" ");
  var dist = parseFloat(distW[0]);
  var time = parseFloat(timeW[0]);
  var dist = dist * 2;
  var time = time * 2;
  var distFnl = dist + " KM";
  var timeFnl = time + " Mins";

  return [distFnl, timeFnl];
}

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    { types: ["geocode"] }
  );
  autocomplete2 = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete2"),
    { types: ["geocode"] }
  );

  autocomplete.setFields(["address_component"]);
  autocomplete2.setFields(["address_component"]);

  autocomplete.addListener("place_changed", fillInAddress);
  autocomplete2.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  console.log("200");
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
