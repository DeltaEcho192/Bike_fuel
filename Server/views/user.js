

const host = 'localhost';
const port = "9000"
var servAddr = "http://"+host+":"+port
let datacheck = {};

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

    const fetchPromise = fetch(servAddr+"/userRoutes");
    fetchPromise.then(response => {

        return response.json();
    }).then(PromiseStatus => {
        var routeData = PromiseStatus
        console.log(routeData[0])
        tableRow(routeData)
        //addRow(routeData)
    });
}

function tableRow(tableData) {
    var table = new Tabulator("#routes-table", {
        height: 300, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: tableData, //assign data to table
        layout: "fitColumns", //fit columns to width of table (optional)
        columns: [ //Define Table Columns
            { title: "Bike", field: "bike", width: 100 },
            { title: "Start Address", field: "start" },
            { title: "End Address", field: "end" },
            /*{ title: "Distance", field: "dist" },
            { title: "Time", field: "timev" },
            { title: "Litres", field: "litre" },
            { title: "Cost", field: "cost" },
            { title: "Stops", field: "stops" },
            { title: "Waypoint 1", field: "waypoint1" },
            { title: "Waypoint 2", field: "waypoint2" },
            { title: "Waypoint 3", field: "waypoint3" },
            */

        ],
        rowClick: function (e, row) { //trigger an alert message when the row is clicked
            row.toggleSelect();
            datacheck = row;
            console.log(row._row.data);
            generateData(row._row.data);
        },
    });

}


function search() {
    const table = Tabulator.prototype.findTable("#routes-table")[0];
    var input = document.getElementById("searchInput");

    var filters = [];
    var columns = table.getColumns();
    var search = input.value;

    columns.forEach(function (column) {
        filters.push({
            field: column.getField(),
            type: "like",
            value: search,
        });
    });
    console.log(filters)
    table.setFilter([filters]);

}

async function deleteRecord() {
    const myTable = Tabulator.prototype.findTable("#routes-table")[0];
    const data = myTable.getSelectedData();
    verf = confirm("Are you sure you want to Delete this row")
    if (verf == true) {
        console.log(data[0]._id);
        const fetchPromise = fetch(servAddr+"/delRoute/" + data[0]._id);
        fetchPromise.then(response => {
            console.log(response.status);
        })
    }
}

function generateData(information){
    let list = document.getElementById("route-info");
    while(list.firstChild)
    {
        list.removeChild(list.firstChild);
    }
    var prefixList = {"bike":"Bike","start":"Start","end":"End","dist":"Distance","litre":"Litre","timev":"Time","stops":"Stops"}
    const keysPrefix = Object.keys(prefixList);
    var maplink = information["mapLink"];
    var ifrm = document.getElementById("mapDisp");
    ifrm.src = maplink
    keysPrefix.forEach((key, index) =>{
        addItem(prefixList[key],information[key])
    })
    var waypoints = information["waypoints"]
    for(i=0;i<waypoints.length;i++)
    {
        var name = "Waypoint "+(i+1)+":"
        addItem(name,waypoints[i])
    }

}

function addItem(prefex,value){
    var datalist = document.getElementById("route-info");
    datalist.innerHTML += "<li>"+prefex+" : "+value+"</li>"
}