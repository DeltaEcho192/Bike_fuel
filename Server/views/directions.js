
var count = 2;
var tblCount = 1;
var fnl;

const host = 'localhost';
const port = "9000"
var servAddr = "http://"+host+":"+port

function addRow() {
    if (count < 5) {
        var field = document.createElement("INPUT");
        field.id = "input" + count;
        field.className = "autocomplete";

        document.getElementById("wrapperFlex").appendChild(field);
        initialize();

        var table = document.getElementById("mainTbl");

        var rowCount = table.rows.length;
        var row = table.insertRow(rowCount);

        var cell1 = row.insertCell(0);
        var element1 = document.createElement("text");
        element1.innerHTML = "Waypoint " + tblCount
        cell1.appendChild(element1);

        var cell2 = row.insertCell(1);
        cell2.id = "waypoint" + tblCount;
        count++;
        tblCount++;
    }
}
function removeRow() {
    try {
        if (count > 2) {
            var inputs = document.getElementById("wrapperFlex");
            console.log(inputs.childElementCount)
            inputs.removeChild(inputs.lastChild)
            var table = document.getElementById("mainTbl");
            var rowCount = table.rows.length;
            table.deleteRow(rowCount - 1)
            tblCount--;
            count--;
        }

    } catch (e) {
        alert(e);
    }
}

function postRow() {
    var bikeV = document.getElementById("bikeList").value;
    var priceV = document.getElementById("priceList").value;

    var data = [];
    for (i = 0; i < count; i++) {
        var name = "input" + i;
        var currentName = document.getElementById(name).value;
        data.push(currentName);
    }
    document.getElementById("startAdTbl").innerHTML = data[0]
    document.getElementById("endAdTbl").innerHTML = data[data.length - 1]
    console.log(tblCount)
    for (x = 1; x < tblCount; x++) {
        var elmtName = "waypoint" + x
        console.log(elmtName)
        console.log(data[x])
        document.getElementById(elmtName).innerHTML = data[x]
    }
    data.push(bikeV);
    data.push(priceV);
    postData(servAddr+"/send", data)

}

function initialize() {
    var acInputs = document.getElementsByClassName("autocomplete");
    for (var i = 0; i < acInputs.length; i++) {
        var autocomplete = new google.maps.places.Autocomplete(acInputs[i]);
        autocomplete.inputId = acInputs[i].id;

        google.maps.event.addListener(autocomplete, "place_changed", function () {
            document.getElementById("log").innerHTML =
                "You used input with id " + this.inputId;
        });
    }
}


async function postData(url, data) {
    (async () => {
        const rawResponse = await fetch(url, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const content = await rawResponse.json();

        console.log(content);
        fnl = JSON.parse(content)
    })().then(function test(data) {
        console.log(fnl)
        var distance = fnl[0] / 1000;
        console.log(fnl[0])
        distancePrinter(distance)
        var time = parseFloat((fnl[1] / 60) / 60);
        timeConverter(time)
        var litre = fnl[2]
        document.getElementById("lTbl").innerHTML = litre + " L";
        var price = fnl[fnl.length - 3] + " " + fnl[3]
        document.getElementById("costTbl").innerHTML = price;
        var stops = fnl[4]
        document.getElementById("stopsTbl").innerHTML = stops;
        var name = fnl[6]
        document.getElementById("bikeTbl").innerHTML = name;
        var ifrm = document.getElementById("mapDisp");
        ifrm.src = fnl[7]
    });
}

function timeConverter(timeDec) {
    var temp = new Array();
    console.log(timeDec)
    temp = timeDec.toString().split('.')
    var minutes = 100 / temp[1];
    minutes = 60 / minutes;
    console.log(minutes)
    minutes = Math.round(minutes).toString();
    console.log(minutes)
    minutes = minutes.slice(0, -minutes.length + 2);
    console.log(temp[0] + 'H : ' + minutes + " M");
    document.getElementById("timeTbl").innerHTML = temp[0] + 'H : ' + minutes + " M";
}

function distancePrinter(distanceDec) {
    var working = distanceDec.toString();
    working = working.slice(0, -2);
    document.getElementById("distTbl").innerHTML = working + " KM";
}

async function saveRoute() {
    var bikeV = document.getElementById("bikeTbl").innerHTML;
    var priceV = document.getElementById("priceList").value;
    var startAdr = document.getElementById("startAdTbl").innerHTML;
    var endAdTbl = document.getElementById("endAdTbl").innerHTML;
    var distance = document.getElementById("distTbl").innerHTML;
    var time = document.getElementById("timeTbl").innerHTML;
    var litre = document.getElementById("lTbl").innerHTML;
    var cost = document.getElementById("costTbl").innerHTML;
    var stops = document.getElementById("stopsTbl").innerHTML;
    var mapLink = document.getElementById("mapDisp").src;
    var waypoints = []
    if (tblCount > 1) {
        for (c = 1; c < tblCount; c++) {
            var wayName = "waypoint" + c
            waypoints.push(document.getElementById(wayName).innerHTML)
        }
    }
    var pushData = [bikeV, priceV, startAdr, endAdTbl, distance, time, litre, cost, stops, waypoints,mapLink];
    console.log(pushData)


    var url = servAddr+"/save"
    data = JSON.stringify(pushData)
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        mode: "cors",
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json'
        },
        body: data
    });
    console.log(response.status)
    if (response.status == 201) {
        window.alert("Route Has Succesfully been saved.")
    }
    if (response.status == 404) {
        window.alert("There has been an Issue with saving the Route.")
    }
}

function logout() {
    var url = servAddr+"logout"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            window.alert("You have been logged out.")
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function onLoadInfo()
{
    getBikeConfig();
    getPriceConfig();
}

function getBikeConfig(){

    const fetchPromise = fetch(servAddr+"/bikeInfo");
    fetchPromise.then(response => {

        return response.json();
    }).then(PromiseStatus => {
        var bikeInfo = PromiseStatus
        //console.log(bikeInfo[0])
        addBikeOption(bikeInfo)
    });
}
let testData = {};
function addBikeOption(data){
    //console.log(data);
    testData = data;
    const keyData = Object.keys(data);
    var bikeInfoCheck = document.getElementById("bikeList");
    keyData.forEach((key, index) =>{
        //console.log(key);
        console.log(data[key][0].name);
        bikeInfoCheck.innerHTML += "<option value='"+key+"'>"+data[key][0].name+"</option>";
    })

}
function getPriceConfig(){
    const fetchPromise = fetch(servAddr+"/priceInfo");
    fetchPromise.then(response => {

        return response.json();
    }).then(PromiseStatus => {
        var priceInfo = PromiseStatus
        //console.log(bikeInfo[0])
        addPriceOption(priceInfo)
    });
}
function addPriceOption(data)
{
    testData = data;
    const keyData = Object.keys(data);
    var priceInfoCheck = document.getElementById("priceList");
    keyData.forEach((key, index) =>{
        //console.log(key);
        console.log(data[key][0].curr);
        priceInfoCheck.innerHTML += "<option value='"+key+"'>"+data[key][0].curr+"</option>";})
}