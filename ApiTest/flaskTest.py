from flask import Flask

app = Flask(__name__)

@app.route("/test")
def index():
    return "Big Titte env"

app.run(host='0.0.0.0', port=5000,debug=True)