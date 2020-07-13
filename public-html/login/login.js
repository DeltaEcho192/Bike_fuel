

async function authenticate() {
    // Default options are marked with *
    var url = "http://localhost:9000/auth"
    var username = document.getElementById("usrname").value;
    var pswd = document.getElementById("pswd").value;
    var data = [username, pswd]

    data = JSON.stringify(data)
    console.log(data)
    const response = await fetch(url, {
        method: 'POST',
        mode: "cors",
        cache: 'no-cache',
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
        if (response.status == 201) {
            window.alert("Successful Login")
            window.location.replace("http://127.0.0.1:5500/public-html/multiAdr/multiAdr.html")
        }

    }
}

