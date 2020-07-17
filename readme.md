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

## Future Additions:
- Login System and being able to save routes.

## Instalations
To run you first have to have docker installed and running on your system.
Then to build the service:
* Enter the working directory
* Run `docker build -t bikefuel/my-apache2 .`
* Run `docker run -dit --name bikefuelserver -p 5500:80 bikefuel/my-apache2`
* Then go into the NodeJS directory
* Run `docker build -t bikefuel/node-web-app .`
* Run `docker run -p 9000:9000 bikefuel/node-web-app`
* Now you can go to http://localhost:5500 and the website will be live.

## Reference:

https://developers.google.com/maps/documentation/directions/start - Google maps directions API
https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform - Google Maps API Auto complete
https://www.youtube.com/watch?v=4T5Gnrmzjak - Jake wright REST API guide (Using Flask and Python)


