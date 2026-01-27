from flask import request, jsonify
from database import get_db
from datetime import datetime

def scan_qr():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid QR data"
        }), 400

    sapId = data.get("sapId")
    hypId = data.get("HypId")

    db = get_db()
    attendance = db["attendance"]
    registration = db["workshop_registration"]

    if attendance.find_one({"sapId": sapId}):   #scan check
        return jsonify({
            "success": False,
            "message": "QR already scanned"
        }), 409


    user = registration.find_one({          #registration check 
        "sap": str(sapId),
        "hypId": hypId
    })

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid QR"
        }), 400

    attendance.insert_one({                  #attendance mark
        "sapId": sapId,
        "hypId": hypId,
        "scannedAt": datetime.utcnow()
    })

    registration.update_one(
        {"sap": str(sapId)},
        {"$set": {"attended": True}}
    )

    return jsonify({
        "success": True,
        "message": "Attendance marked successfully"
    }), 200
