from flask import Flask, redirect

app = Flask(__name__)
USER_ID_COUNTER = 0
DEV_OB_URL = "https://developer-study.cs.umd.edu"

@app.route("/")
def index():
    global USER_ID_COUNTER

    USER_ID_COUNTER += 1
    return redirect(f"{DEV_OB_URL}?ext_ref=test{USER_ID_COUNTER}&custom1=1")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3012)

