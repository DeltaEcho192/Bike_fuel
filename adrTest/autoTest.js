function initialize() {
  var acInputs = document.getElementsByClassName("autocomplete");

  for (var i = 0; i < acInputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(acInputs[i]);
    autocomplete.inputId = acInputs[i].id;

    google.maps.event.addListener(autocomplete, "place_changed", function () {
      document.getElementById("log").innerHTML =
        "You used input with id " + this.inputId;
    });
  }
}
