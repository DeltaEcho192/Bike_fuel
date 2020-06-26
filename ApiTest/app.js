const request = require('request');

request('https://maps.googleapis.com/maps/api/directions/json?origin=2+Faure+St,+Kromrivier,+Stellenbosch,+7600&destination=8+Groeneweide+Rd,+Universiteits+Oord,+Stellenbosch,+7600&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  //console.log(body.url);
  console.log(body.routes.legs.distance);


});
