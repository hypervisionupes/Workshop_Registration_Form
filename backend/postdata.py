from flask import request, jsonify
from database import get_db
import re

def addsubmission():
    try:
        db = get_db()
        collection = db["registrations"]

        data = request.get_json()

        required_fields = ["name", "sap", "email", "phone", "orbit", "expectations"]

        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        email = data["email"]
        phone = str(data["phone"])
        sap = str(data["sap"])
        hyp_id = data.get("hypId", "")

        if not re.fullmatch(r"\d{10}", phone):
            return jsonify({
                "success": False,
                "message": "Phone number must be exactly 10 digits"
            }), 400

        if not re.fullmatch(r"5900\d{5}", sap):
            return jsonify({
                "success": False,
                "message": "SAP ID must be 10 digits and start with 5900"
            }), 400

        if hyp_id:
            if not hyp_id.startswith("HYPE") or hyp_id != hyp_id.upper():
                return jsonify({
                    "success": False,
                    "message": "Hypervision ID must start with 'HYPE' "
                }), 400

        # Duplicate checks
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
            "sap": sap,
            "email": email,
            "phone": phone,
            "orbit": data["orbit"],
            "expectations": data["expectations"],
            "hypId": hyp_id
        }

        collection.insert_one(document)

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error",
            "error": str(e)
        }), 500
