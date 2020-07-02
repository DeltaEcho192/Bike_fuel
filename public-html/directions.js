var placeSearch, autocomplete,autocomplete2;

var place = [];

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function apiCall(){
    console.log(place)
    console.log(document.getElementById("rtn").checked)
    var bikeV = document.getElementById("bikeList").value
    bikeNamer(bikeV)
    var url=adrMaker();
    console.log(url)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        var distance = apireturn.routes[0].legs[0].distance.value
        var distDisplay = apireturn.routes[0].legs[0].distance.text
        var time = apireturn.routes[0].legs[0].duration.text
        if(document.getElementById("rtn").checked == true)
        {
            distance = distance * 2;
            var dispValues = rtn(distDisplay,time)
            document.getElementById("distTbl").innerHTML = dispValues[0]
            document.getElementById("timeTbl").innerHTML = dispValues[1]
            console.log("Return Distance Checked")

        }
        else
        {
            document.getElementById("distTbl").innerHTML = distDisplay
            document.getElementById("timeTbl").innerHTML = time
        }
        calculations(distance,time,bikeV)
        stopCheck(distance)
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    
}

function bikeNamer(str) {
    var splitStr = str.toLowerCase().split('_');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    var bikefnl = splitStr.join(' '); 
    document.getElementById("bikeTbl").innerHTML = bikefnl;
 }

function adrMaker()
{
    var startAdr = document.getElementById("autocomplete").value
    console.log(startAdr)
    var strStartAdr = startAdr.split(" ")
    document.getElementById("startAdTbl").innerHTML = startAdr
    var fnlStartAdr = strStartAdr.join("+")
    console.log(fnlStartAdr)
    var endAdr = document.getElementById("autocomplete2").value
    console.log(endAdr)
    document.getElementById("endAdTbl").innerHTML = endAdr
    var strEndAdr = endAdr.split(" ")
    var fnlEndAdr = strEndAdr.join("+")
    console.log(fnlEndAdr)

    var url= 'http://localhost:9000/direc/'+ fnlStartAdr +"/"+fnlEndAdr;
    var ifrm = document.getElementById("mapDisp")
    ifrm.src = "https://www.google.com/maps/embed/v1/directions?origin="+fnlStartAdr +"&destination="+fnlEndAdr + "&key=AIzaSyAIf-vJKm6y4vhqsCFdMkuRYIOjb8Q8rxM"
    return url

}

function calculations(distance,time,bike)
{
    url = "http://localhost:9000/bike/" + bike
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        var apireturn = JSON.parse(xmlHttp.responseText);
        console.log(apireturn[0].fuel_eff)
        console.log(apireturn[0].tank)

        var fuelEff = apireturn[0].fuel_eff
        var fuelPrice = 13.20
        var fuelUsage = fuelEff * distance
        var fuelUsage = Math.round(fuelUsage * 100) / 100
        document.getElementById("lTbl").innerHTML = fuelUsage + " L"
        console.log(fuelUsage) 
        var fnlCost = fuelUsage * fuelPrice
        var fnlCost = Math.round(fnlCost * 100) / 100
        document.getElementById("costTbl").innerHTML = "R " + fnlCost
        console.log(fnlCost)

        var amtStops = distance / (apireturn[0].range * 1000)
        if (amtStops < 1)
        {
            amtStops = Math.floor(amtStops);
        }
        else
        {
            amtStops = Math.ceil(amtStops)
        }
        document.getElementById("stopsTbl").innerHTML = amtStops
        console.log(amtStops)
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    
}

function stopCheck(distance)
{
    var amtStops = Math.floor(distance / 200000)
    document.getElementById("stopsTbl").innerHTML = amtStops
    console.log(amtStops)
}

function rtn(dispDist,time)
{
    var distW = dispDist.split(" ")
    var timeW = time.split(" ")
    var dist = parseFloat(distW[0])
    var time = parseFloat(timeW[0])
    var dist = dist * 2
    var time = time * 2
    var distFnl = dist + " KM"
    var timeFnl = time + " Mins"

    return [distFnl,timeFnl]
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), {types: ['geocode']});
    autocomplete2 = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete2'), {types: ['geocode']});
  
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);
    autocomplete2.setFields(['address_component']);
  
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
    autocomplete2.addListener('place_changed',fillInAddress);
  }


  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
      console.log(place);
    for (var component in componentForm) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }
  
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        console.log(val);
        place.push(val);
      }
    }
  }

function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle(
            {center: geolocation, radius: position.coords.accuracy});
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }