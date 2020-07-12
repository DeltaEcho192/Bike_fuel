var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'xxmaster',
    database: 'bike_fuel'
});


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


var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    console.log(password)
    if (username && password) {
        var sqlQuery = 'SELECT * FROM users WHERE usrname = "' + username + '" AND pswd = "' + password + '";';

        console.log(sqlQuery)
        connection.query(sqlQuery, function (error, results, fields) {
            if (results.length > 0) {
                response.send("User Already Exists")
            } else {
                database = new Database({
                    host: 'localhost',
                    user: 'root',
                    password: 'xxmaster',
                    database: 'bike_fuel'
                })
                var useridQuery = "SELECT userid FROM users ORDER BY userid DESC LIMIT 1"
                database.query(useridQuery).then(rows => insert(rows[0].userid, username, password))
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
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


app.listen(15000);