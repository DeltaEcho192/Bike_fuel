
const host = 'localhost';
const port = "9000"
var servAddr = "http://"+host+":"+port
async function authenticate() {
    // Default options are marked with *
    var url = servAddr+"/auth"
    var username = document.getElementById("usrname").value;
    var pswd = document.getElementById("pswd").value;
    var data = [username, pswd]

    data = JSON.stringify(data)
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        mode: "cors",
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json'
        },
        body: data
    });
    console.log(response.status)
    if (response.status > 400) {
        window.alert("Incorrect Username and/or Password!")
    }
    else {
        if (response.status == 200) {
            window.alert("Successful Login")
            window.location.href = response.url;
        }

    }
}

function logout() {
    var url = servAddr+"/logout"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            window.alert("You have been logged out.")
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}