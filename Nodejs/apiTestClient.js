function apiCall(){
    const url="http://localhost:4000/test";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp.responseText)
        document.getElementById("Testing").innerHTML = xmlHttp.responseText
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}