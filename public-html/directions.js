function apiCall(){
    const url='https://maps.googleapis.com/maps/api/directions/json?origin=2+Faure+St,+Kromrivier,+Stellenbosch,+7600&destination=8+Groeneweide+Rd,+Universiteits+Oord,+Stellenbosch,+7600&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        var distance = apireturn.routes[0].legs[0].distance.value
        var distDisplay = apireturn.routes[0].legs[0].distance.text
        var time = apireturn.routes[0].legs[0].duration.text
        console.log(distance)
        console.log(distDisplay)
        console.log(time)
        document.getElementById("distTbl").innerHTML = distDisplay
        calculations(distance,time)
        stopCheck(distance)
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}


function calculations(distance,time)
{
    var fuelEff = 0.00006
    var fuelPrice = 13.20
    
    var fuelUsage = fuelEff * distance
    var fuelUsage = Math.round(fuelUsage * 100) / 100
    document.getElementById("lTbl").innerHTML = fuelUsage + " L"
    console.log(fuelUsage) 
    var fnlCost = fuelUsage * fuelPrice
    var fnlCost = Math.round(fnlCost * 100) / 100
    document.getElementById("costTbl").innerHTML = "R " + fnlCost
    console.log(fnlCost)
}

function stopCheck(distance)
{
    var amtStops = Math.floor(distance / 200000)
    document.getElementById("stopsTbl").innerHTML = amtStops
    console.log(amtStops)
}
