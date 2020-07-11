var count = 2;
var tblCount = 1;
var fnl;

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
    postData("http://localhost:9000/send", data)

}

function initialize() {
    var acInputs = document.getElementsByClassName("autocomplete");
    console.log(acInputs);
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
        document.getElementById("distTbl").innerHTML = distance;
        var time = (fnl[1] / 60) / 60;
        document.getElementById("timeTbl").innerHTML = time;
        var litre = fnl[2]
        document.getElementById("lTbl").innerHTML = litre;
        var price = fnl[fnl.length - 2] + " " + fnl[3]
        document.getElementById("costTbl").innerHTML = price;
        var stops = fnl[4]
        document.getElementById("stopsTbl").innerHTML = stops;
        var name = fnl[6]
        document.getElementById("bikeTbl").innerHTML = name;
    });
}

