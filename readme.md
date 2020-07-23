# Bike Fuel Application

## Description:

This application will take in a starting and a ending destination and then using a REST API query and calculate the distance and amount of fuel needed for a given motorcycle to travel the distance and the cost of this journey.

Basic Function:
- The user enters a starting and ending location that is auto filled by Google Maps Javescript API
- The data is then parsed to Googles Maps Directions API which will calculate the distance and the time taken to travel this distance
- This data is returned in JSON format
- This data will then be used in a REST API call which will return the fuel usage, cost and if it exceds the tank limit of the bike.
- The data will then be displayed on a table for the user to evaluate.

## Requirments:
- Javascript
- Google Maps API's
- Docker
- Node JS

## Instalations
To run you first have to have docker installed and running on your system.
MySQL:
* Install MYSQL comunity server on your system.
* To create database you can use PHPmyadmin or mysql workbench to test and open a connection to the database
* Once you have successfully connected to the database. Open the DatabaseCreation.sql file and execute it.
* This will create all the tables you need.

Reddis Server:
* Enter Main directory in the terminal
* Run `docker-compose up`

Then to build the service:
* Download and install Node JS
* Enter Main directory in the terminal
* Run `npm install`
* Run `node bikeFuelServer.js`

The website will then be available at `http://localhost:9000`
## Reference:

https://developers.google.com/maps/documentation/directions/start - Google maps directions API
https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform - Google Maps API Auto complete
https://www.youtube.com/watch?v=4T5Gnrmzjak - Jake wright REST API guide (Using Flask and Python)


