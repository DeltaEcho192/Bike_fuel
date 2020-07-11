var count = 0;
var fnl;

function addRow() {
  var btn = document.createElement("INPUT");
  btn.id = "test" + count;
  btn.className = "autocomplete";
  count++;
  document.getElementById("wrapperFlex").appendChild(btn);
  initialize();
}
function postRow() {
  var data = [];
  for (i = 0; i < count; i++) {
    var name = "test" + i;
    var currentName = document.getElementById(name).value;
    data.push(currentName);
  }
  data.push(1);
  data.push(1);
  postData("http://localhost:9000/send", data)

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


// Example POST method implementation:
async function postData(url, data) {
  (async () => {
    const rawResponse = await fetch(url, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const content = await rawResponse.json();

    console.log(content);
    fnl = content
  })().then(function test(data) {
    console.log(fnl)
  });
}

