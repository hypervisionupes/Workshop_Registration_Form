from flask import request, jsonify
from database import get_db

def addsubmission():
    try:
        db = get_db()
        collection = db["workshop_registration"]

        data = request.get_json()

        required_fields = ["name", "sap", "email", "phone", "orbit", "expectations"]

        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        email = data["email"]
        phone = data["phone"]

        if collection.find_one({"email": email}):
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

        if collection.find_one({"phone": phone}):
            return jsonify({
                "success": False,
                "message": "Phone number already registered"
            }), 409

        document = {
            "name": data["name"],
            "sap": data["sap"],
            "email": email,
            "phone": phone,
            "orbit": data["orbit"],
            "expectations": data["expectations"],
            "hypId": data.get("hypId", ""),
        }

        collection.insert_one(document)

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error",
            "error": str(e)
        }), 500
