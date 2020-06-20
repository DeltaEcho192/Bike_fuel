
const url='https://maps.googleapis.com/maps/api/directions/json?origin=2+Faure+St,+Kromrivier,+Stellenbosch,+7600&destination=8+Groeneweide+Rd,+Universiteits+Oord,+Stellenbosch,+7600&key=APIKEY';
var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    console.log("Success");
    var apireturn = JSON.parse(xmlHttp.responseText);
    document.getElementById("output").innerHTML = apireturn
}
xmlHttp.open("GET", url, true);
xmlHttp.send();
