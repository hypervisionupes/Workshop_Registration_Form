from flask import Flask
from postdata import addsubmission
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # important for React frontend

@app.route("/register", methods=["POST"])
def register():
    return addsubmission()

if __name__ == "__main__":
    app.run(debug=True)
