
const url='https://maps.googleapis.com/maps/api/directions/json?origin=2+Faure+St,+Kromrivier,+Stellenbosch,+7600&destination=8+Groeneweide+Rd,+Universiteits+Oord,+Stellenbosch,+7600&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM';
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    var apireturn = JSON.parse(xmlHttp.responseText);
    document.getElementById("output").innerHTML = apireturn.routes[0].legs[0].distance.value
    var distance = apireturn.routes[0].legs[0].distance.value
    var distDisplay = apireturn.routes[0].legs[0].distance.text
    var time = apireturn.routes[0].legs[0].duration.text
    console.log(distance)
    console.log(distDisplay)
    console.log(time)
    calculations(distance,time)
}
xmlHttp.open("GET", url, true);
xmlHttp.send();

function calculations(distance,time)
{
    var fuelEff = 0.00006
    var fuelPrice = 13.20
    
    var fuelUsage = fuelEff * distance
    console.log(fuelUsage) 
    var fnlCost = fuelUsage * fuelPrice
    console.log(fnlCost)

}

