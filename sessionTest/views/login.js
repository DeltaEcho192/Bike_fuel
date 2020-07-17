

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

