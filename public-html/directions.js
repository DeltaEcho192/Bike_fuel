function apiCall(){
     
    var url=adrMaker();
    console.log(url)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        var distance = apireturn.routes[0].legs[0].distance.value
        var distDisplay = apireturn.routes[0].legs[0].distance.text
        var time = apireturn.routes[0].legs[0].duration.text
        document.getElementById("distTbl").innerHTML = distDisplay
        calculations(distance,time)
        stopCheck(distance)
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    
}

function adrMaker()
{
    var startAdr = document.getElementById("startAdr").value
    var startCity = document.getElementById("startCity").value
    var startZip = document.getElementById("startZip").value
    var endAdr = document.getElementById("endAdr").value
    var endCity = document.getElementById("endCity").value
    var endZip = document.getElementById("endZip").value

    var fnlStartAdr = startAdr + ", "+startCity+", " + startZip
    var fnlEndAdr = endAdr + ", " + endCity + ", " + endZip
    document.getElementById("startAdTbl").innerHTML = fnlStartAdr
    document.getElementById("endAdTbl").innerHTML = fnlEndAdr
    var startArr = fnlStartAdr.split(" ")
    var endArr = fnlEndAdr.split(" ")
    fnlStartAdr = startArr.join("+")
    fnlEndAdr = endArr.join("+")
    var url= 'http://localhost:9000/direc/'+ fnlStartAdr +"/"+fnlEndAdr;

     
    return url

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
