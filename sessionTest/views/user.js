
function addRow(routeData) {
    for (i = 0; i < routeData.length; i++) {
        console.log(routeData[i])
        var currentData = routeData[i]
        Object.entries(currentData).forEach(
            ([key, value]) => {
                if (value != null) {
                    var field = document.createElement("P");
                    field.className = "datafield";
                    field.innerHTML = value
                    var fieldName = "info" + (i + 1)
                    console.log(fieldName)
                    document.getElementById(fieldName).appendChild(field);
                }
                else {
                    console.log("Value was null")
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