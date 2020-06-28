function apiCall(){
    console.log(document.getElementById("rtn").checked)
    var bikeV = document.getElementById("bikeList").value
    bikeNamer(bikeV)
    var url=adrMaker();
    console.log(url)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        var distance = apireturn.routes[0].legs[0].distance.value
        var distDisplay = apireturn.routes[0].legs[0].distance.text
        var time = apireturn.routes[0].legs[0].duration.text
        if(document.getElementById("rtn").checked == true)
        {
            distance = distance * 2;
            var dispValues = rtn(distDisplay,time)
            document.getElementById("distTbl").innerHTML = dispValues[0]
            document.getElementById("timeTbl").innerHTML = dispValues[1]
            console.log("Return Distance Checked")

        }
        else
        {
            document.getElementById("distTbl").innerHTML = distDisplay
            document.getElementById("timeTbl").innerHTML = time
        }
        calculations(distance,time,bikeV)
        stopCheck(distance)
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    
}

function bikeNamer(str) {
    var splitStr = str.toLowerCase().split('_');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    var bikefnl = splitStr.join(' '); 
    document.getElementById("bikeTbl").innerHTML = bikefnl;
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
    var ifrm = document.getElementById("mapDisp")
    ifrm.src = "https://www.google.com/maps/embed/v1/directions?origin="+fnlStartAdr +"&destination="+fnlEndAdr + "&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM"
    return url

}

function calculations(distance,time,bike)
{
    url = "http://localhost:9000/bike/" + bike
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        console.log(apireturn[0].fuel_eff)
        console.log(apireturn[0].tank)

        var fuelEff = apireturn[0].fuel_eff
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
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    
}

function stopCheck(distance)
{
    var amtStops = Math.floor(distance / 200000)
    document.getElementById("stopsTbl").innerHTML = amtStops
    console.log(amtStops)
}

function rtn(dispDist,time)
{
    var distW = dispDist.split(" ")
    var timeW = time.split(" ")
    var dist = parseFloat(distW[0])
    var time = parseFloat(timeW[0])
    var dist = dist * 2
    var time = time * 2
    var distFnl = dist + " KM"
    var timeFnl = time + " Mins"

    return [distFnl,timeFnl]
}