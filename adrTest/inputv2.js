var count = 0;

function addRow() {
  var btn = document.createElement("INPUT");
  btn.id = "test" + count;
  btn.className = "autocomplete";
  count++;
  document.getElementById("wrapperFlex").appendChild(btn);
  initialize();
}
function postRow() {
  for (i = 0; i < count; i++) {
    var name = "test" + i;
    var currentName = document.getElementById(name).value;
    console.log(currentName);
  }
}

function initialize() {
  var acInputs = document.getElementsByClassName("autocomplete");
  console.log(acInputs);
  for (var i = 0; i < acInputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(acInputs[i]);
    autocomplete.inputId = acInputs[i].id;

    google.maps.event.addListener(autocomplete, "place_changed", function () {
      document.getElementById("log").innerHTML =
        "You used input with id " + this.inputId;
    });
  }
}
