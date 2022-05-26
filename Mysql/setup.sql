CREATE DATABASE bike_fuel;
USE bike_fuel;
SELECT * FROM users;
SELECT userid FROM users WHERE usrname = "admin" AND pswd = "xxmaster";
SHOW DATABASES;
CREATE TABLE users (
userid int,
usrname VARCHAR(255),
pswd VARCHAR(255));

CREATE TABLE routes(
routeID int AUTO_INCREMENT,
userid int,
bike VARCHAR(255),
startAdr VARCHAR(255),
endAdr VARCHAR(255),
distance VARCHAR(255),
timevar VARCHAR(255),
litre VARCHAR(255),
cost VARCHAR(255),
stops VARCHAR(255),
waypoint1 VARCHAR(255),
waypoint2 VARCHAR(255),
waypoint3 VARCHAR(255),
waypoint4 VARCHAR(255),
waypoint5 VARCHAR(255),
Primary Key(routeID)
);
INSERT INTO users VALUES (1,"admin","xxmaster");