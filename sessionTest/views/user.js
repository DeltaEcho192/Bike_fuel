
function addRow(routeData) {
    for (i = 0; i < routeData.length; i++) {
        console.log(routeData[i])
        var currentData = routeData[i]
        var rowObj = document.createElement("tr");
        rowObj.id = "result" + i;
        document.getElementById("resultTbl").appendChild(rowObj);
        bikeID = 0;
        Object.entries(currentData).forEach(
            ([key, value]) => {
                if (bikeID == 0) {
                    console.log(value)
                    bikeID++;
                }
                else {
                    if (value != null) {
                        var field = document.createElement("td");
                        field.className = "datafield";
                        field.innerHTML = value
                        var fieldName = "result" + i
                        console.log(fieldName)
                        document.getElementById(fieldName).appendChild(field);
                    }
                    else {
                        console.log("Value was null")
                    }
                }
            }
        );

    }


}

function rowFiller() {
    fuelGet()
}

async function fuelGet() {

    const fetchPromise = fetch("http://localhost:9000/userRoutes");
    fetchPromise.then(response => {

        return response.json();
    }).then(PromiseStatus => {
        var routeData = PromiseStatus
        console.log(routeData[0])
        addRow(routeData)
    });
}