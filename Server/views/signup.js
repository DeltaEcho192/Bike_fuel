async function signup() {
    // Default options are marked with *
    var url = "http://localhost:9000/signup"
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
    console.log(response)
    if (response.status == 200) {
        window.alert("Sign up has been successful.")
        window.location.href = response.url;
    }
    if (response.status == 406) {
        window.alert("A user with this username has already been taken.")
    }

}

