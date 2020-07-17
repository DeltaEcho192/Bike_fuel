CREATE DATABASE bike_fuel;
USE bike_fuel;
CREATE TABLE users (
userid int,
usrname VARCHAR(255),
pswd VARCHAR(255));

CREATE TABLE routes(
userid int,
bike int,
price int,
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
waypoint5 VARCHAR(255)
);