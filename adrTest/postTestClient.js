async function postData(url, data) {
  (async () => {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const content = await rawResponse.json();

    console.log(content);
    fnl = content
  })();
}
postData("http://127.0.0.1:8500/testing", ["test"])
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
