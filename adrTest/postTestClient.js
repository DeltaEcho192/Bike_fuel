function updateClient(postData) {
  var miss = ["one second", "two Second"];
  var yourUrl = "http://localhost:9000/test";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", yourUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      test: miss,
    })
  );
}
function corsTest() {
  var url = "http://localhost:9000/sample/put/give/";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      var apireturn = xmlHttp.responseText;
    console.log(apireturn);
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}
