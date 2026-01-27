from flask import Flask
from postdata import addsubmission
from flask_cors import CORS
from scanqr import scan_qr

app = Flask(__name__)
CORS(app)  # important for React frontend

@app.route("/register", methods=["POST"])
def register():
    return addsubmission()

@app.route("/scan-qr", methods=["POST"])
def scanqr():
    return scan_qr()
    
if __name__ == "__main__":
    app.run(debug=True)

