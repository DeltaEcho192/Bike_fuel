var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
const bent = require('bent')
const fs = require("fs");
const getJSON = bent('json')
var cors = require('cors')
var path = require('path');
var mysql = require('mysql');
var session = require('express-session');
const { response } = require("express");
const router = express.Router();
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();

const app = express();

var sass;

app.options('*', cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


app.use(session({
    secret: 'ssshhhhh',
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
    saveUninitialized: true, resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//
//Single Route API Requests
//
router.get('/', (req, res) => {
    if (sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile('index.html');
});

router.get('/multiAdr', (req, res) => {

    if (req.session.key) {
        console.log("Session User ID after" + req.session.key["userid"])
    }
    res.redirect('multiAdr.html')
});

router.get('/login', (req, res) => {
    res.redirect('login.html')

})

router.get('/loginCheck', (req, res) => {
    res.send("Okay");
    console.log(req.session.key)

})


app.get("/direc/:start/:end", (req, res) => {
    var fnlurl =
        "https://maps.googleapis.com/maps/api/directions/json?origin=" +
        encodeURI(req.params.start) +
        "&destination=" +
        encodeURI(req.params.end) +
        "&units=metric&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
    request({ url: fnlurl }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.status(500).json({ type: "error", message: err.message });
        }
        res.json(JSON.parse(body));
    });
});

app.get("/bike/:id", (req, res) => {
    fs.readFile("info.json", (err, data) => {
        if (err) throw err;
        var idBike = req.params.id;
        console.log(idBike);
        let bikes = JSON.parse(data);
        console.log(bikes[idBike]);
        res.json(bikes[idBike]);
    });
});

app.get("/price/:id", (req, res) => {
    fs.readFile("price.json", (err, data) => {
        if (err) throw err;
        var idPrice = req.params.id;
        let price = JSON.parse(data);
        console.log(price[idPrice]);
        res.json(price[idPrice]);
    });
});

//
//Multi Route API Requests
//

app.post("/send", function (req, res) {
    console.log("receiving data ...");
    console.log("body is ", req.body);
    arrTest = req.body;
    var bike = bikeID(arrTest[arrTest.length - 2])
    var price = priceID(arrTest[arrTest.length - 1])
    console.log(bike)
    var testValues = ["Cape Town, South Africa", "George, South Africa", "Durban, South Africa", "Johannesburg, South Africa", 1, 1]
    var url = adrMaker(arrTest)
    calculations(url[0], bike[0], bike[1], price[1], price[0], bike[2], url[1]).then((value) => res.json(JSON.stringify(value)))
});

function adrMaker(names) {
    //Check if waypoints added
    var waypoints = "&waypoints="
    var startAdr = names[0];
    var strStartAdr = startAdr.split(" ");
    var fnlStartAdr = strStartAdr.join("+");

    var endAdr = names[names.length - 3];
    var strEndAdr = endAdr.split(" ");
    var fnlEndAdr = strEndAdr.join("+");

    for (i = 1; i < names.length - 3; i++) {
        var working = names[i];
        var work1 = working.split(" ");
        var work2 = work1.join("+")
        waypoints = waypoints + work2 + "|";
    }
    var fnlwaypoints = waypoints.slice(0, -1);
    var fnlurl =
        "https://maps.googleapis.com/maps/api/directions/json?origin=" +
        fnlStartAdr +
        "&destination=" +
        fnlEndAdr + fnlwaypoints +
        "&units=metric&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
    var embedUrl = "https://www.google.com/maps/embed/v1/directions?origin=" +
        fnlStartAdr +
        "&destination=" +
        fnlEndAdr + fnlwaypoints +
        " &key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM";
    return [fnlurl, embedUrl]
}

async function calculations(fnlurl, bikeEff, bikeRange, price, symbol, nameBike, embUrl) {
    var distTotal = []
    var timeTotal = []
    var rtnValues = []
    let obj = await getJSON(fnlurl)
    var apiReturn = obj
    console.log(apiReturn.routes[0].legs.length)
    for (i = 0; i < apiReturn.routes[0].legs.length; i++) {
        var distanceVar = apiReturn.routes[0].legs[i].distance.value;
        var time = apiReturn.routes[0].legs[i].duration.value;
        var timeText = apiReturn.routes[0].legs[i].duration.text;

        distTotal.push(distanceVar)
        timeTotal.push(time)
    }

    var distance = distTotal.reduce((a, b) => a + b, 0)

    var totalTime = timeTotal.reduce((a, b) => a + b, 0)

    var fuelUsage = bikeEff * distance;
    var fuelUsage = Math.round(fuelUsage * 100) / 100;

    var fnlCost = fuelUsage * price;
    var fnlCost = Math.round(fnlCost * 100) / 100;


    var amtStops = distance / (bikeRange * 1000);
    if (amtStops < 1) {
        amtStops = Math.floor(amtStops);
    } else {
        amtStops = Math.ceil(amtStops);
    }
    rtnValues.push(distance, totalTime, fuelUsage, fnlCost, amtStops, symbol, nameBike, embUrl)
    return rtnValues
}

function bikeID(bikeId) {
    var bike = fs.readFileSync("info.json", 'utf8');
    bike = JSON.parse(bike);
    bikeData = bike[bikeId]
    fuelEff = bikeData[0].fuel_eff;
    tankSize = bikeData[0].range;
    bikeName = bikeData[0].name;
    return [fuelEff, tankSize, bikeName]
}
function priceID(priceId) {
    var price = fs.readFileSync("price.json", 'utf8');
    price = JSON.parse(price);
    var priceData = price[priceId];
    var symbol = priceData[0].symbol
    var priceFnl = priceData[0].price
    return [symbol, priceFnl]
}

//
//Login System
//

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xxmaster',
    database: 'bike_fuel'
});


router.post('/auth', function (request, response) {
    var username = request.body[0];
    var password = request.body[1];
    console.log("username" + username);
    console.log("password" + password);
    if (username && password) {
        var sqlQuery = 'SELECT userid FROM users WHERE usrname = "' + username + '" AND pswd = "' + password + '";';
        console.log(sqlQuery)
        connection.query(sqlQuery, function (error, results, fields) {
            console.log(results.length)
            if (results.length > 0) {
                request.session.loggedin = true;
                console.log(results[0].userid)
                request.session.key = results[0].userid;
                response.redirect('/');
            } else {
                response.send(404)
                console.log("not correct")
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

router.post('/save', function (request, response) {
    if (request.session.key) {
        var nullCounter = 5
        console.log("Session User ID after " + request.session.key)
        var userId = request.session.key
        var bikeName = request.body[0]
        var price = request.body[1]
        var startAdr = request.body[2]
        var endAdTbl = request.body[3]
        var distance = request.body[4]
        var time = request.body[5]
        var litre = request.body[6]
        var cost = request.body[7]
        var stops = request.body[8]
        var waypoints = request.body[9]
        var baseSql = "INSERT INTO routes VALUES (" + userId + "," + bikeName + "," + price + ',"' + startAdr + '","' + endAdTbl + '","' + distance + '","' + time + '","' + litre + '","' + cost + '","' + stops;
        if (waypoints.length > 0) {
            for (v = 0; v < waypoints.length; v++) {
                baseSql = baseSql + '","' + waypoints[v]
                nullCounter--;
            }
            baseSql = baseSql + '"'
            for (b = 0; b < nullCounter; b++) {
                baseSql = baseSql + ',' + null
            }
            baseSql = baseSql + ');'
        }
        else {
            baseSql = "INSERT INTO routes VALUES (" + userId + "," + bikeName + "," + price + ',"' + startAdr + '","' + endAdTbl + '","' + distance + '","' + time + '","' + litre + '","' + cost + '","' + stops + '",' + null + ',' + null + ',' + null + ',' + null + ',' + null + ');';

        }
        console.log(userId)
        //console.log(userId + " " + bikeName + " " + price + " " + startAdr + " " + endAdTbl + " " + distance + " " + time + " " + litre + " " + cost + " " + stops + " " + waypoints)
        console.log(baseSql)
        connection.query(baseSql, function (error, results, fields) {
            if (error) throw error;
            console.log("1 record inserted");
            response.status(201);
            response.end();
        });
    } else {
        response.status(404)
        response.end();
    }

});



app.get('/test', function (request, response) {
    sass = request.session;
    console.log(sass.loggedin)
    console.log(sass.username)
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});


//
//Sign up system
//

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}


app.post('/signup', function (request, response) {
    var username = request.body[0];
    var password = request.body[1];
    console.log(username);
    console.log(password)
    if (username && password) {
        var sqlQuery = 'SELECT * FROM users WHERE usrname = "' + username + '" AND pswd = "' + password + '";';

        console.log(sqlQuery)
        connection.query(sqlQuery, function (error, results, fields) {
            if (results.length > 0) {
                response.status(406)
            } else {
                database = new Database({
                    host: 'localhost',
                    user: 'root',
                    password: 'xxmaster',
                    database: 'bike_fuel'
                })
                var useridQuery = "SELECT userid FROM users ORDER BY userid DESC LIMIT 1"
                database.query(useridQuery).then(rows => insert(rows[0].userid, username, password))
                console.log("Entering user")
                response.redirect('/login')

            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

function insert(newId, username, password) {
    console.log(newId)
    newId = newId + 1;
    var sqlInsert = 'INSERT INTO users VALUES (' + newId + ',"' + username + '","' + password + '");';
    console.log(sqlInsert)
    connection.query(sqlInsert, function (error, results) {
        console.log("User entered")
    })

}

app.use('/', router);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
