from flask import request, jsonify
from database import get_db
import re

def sanitize_string(value, max_length=None):
    """Sanitize string input to prevent NoSQL injection"""
    if not isinstance(value, str):
        return str(value)
    
    # Remove null bytes and control characters (security)
    sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', value)
    
    # Strip whitespace
    sanitized = sanitized.strip()
    
    # Truncate if max_length specified
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized

def addsubmission():
    try:
        db = get_db()
        collection = db["workshop_registration"]

        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400

        required_fields = ["name", "sap", "email", "phone", "orbit", "expectations", "hypId"]

        # Check required fields
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        # Extract and sanitize inputs
        name = sanitize_string(data["name"], max_length=100)
        email = sanitize_string(data["email"], max_length=254).lower()
        phone = str(data["phone"]).strip()
        sap = str(data["sap"]).strip()
        orbit = str(data["orbit"]).strip()
        expectations = sanitize_string(data["expectations"], max_length=500)
        hyp_id = str(data["hypId"]).strip().upper()

        # Validate name length
        if len(name) < 2:
            return jsonify({
                "success": False,
                "message": "Name must be at least 2 characters"
            }), 400
        
        if len(name) > 100:
            return jsonify({
                "success": False,
                "message": "Name must not exceed 100 characters"
            }), 400

        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.fullmatch(email_pattern, email):
            return jsonify({
                "success": False,
                "message": "Invalid email format"
            }), 400

        # Validate phone number
        if not re.fullmatch(r"\d{10}", phone):
            return jsonify({
                "success": False,
                "message": "Phone number must be exactly 10 digits"
            }), 400

        # Validate SAP ID (can start with 5000 or 5900)
        if not re.fullmatch(r"(5000|5900)\d{5}", sap):
            return jsonify({
                "success": False,
                "message": "SAP ID must be 9 digits and start with 5000 or 5900"
            }), 400

        # Validate orbit (year)
        if orbit not in ["1", "2", "3", "4"]:
            return jsonify({
                "success": False,
                "message": "Invalid year selection"
            }), 400

        # Validate expectations length
        if len(expectations) < 5:
            return jsonify({
                "success": False,
                "message": "Expectations must be at least 5 characters"
            }), 400
        
        if len(expectations) > 500:
            return jsonify({
                "success": False,
                "message": "Expectations must not exceed 500 characters"
            }), 400

        # Validate hypId format (HYPE + 4 digits)
        if not re.fullmatch(r"HYPE\d{4}", hyp_id):
            return jsonify({
                "success": False,
                "message": "Hypervision ID must be in format HYPE1234"
            }), 400

        # Verify Hypervision ID exists in hypervision_members collection
        hypervision_collection = db["hypervision_members"]
        member = hypervision_collection.find_one({"hypervision_id": {"$eq": hyp_id}})
        
        if not member:
            return jsonify({
                "success": False,
                "message": "Invalid Hypervision ID. You must be a Hypervision member."
            }), 403
        
        # Verify SAP ID matches the Hypervision member record
        if member.get("sapid") != sap:
            return jsonify({
                "success": False,
                "message": "SAP ID does not match Hypervision member record"
            }), 403

        # Duplicate checks with sanitized queries
        if collection.find_one({"email": {"$eq": email}}):
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

        if collection.find_one({"phone": {"$eq": phone}}):
            return jsonify({
                "success": False,
                "message": "Phone number already registered"
            }), 409
        
        if collection.find_one({"sap": {"$eq": sap}}):
            return jsonify({
                "success": False,
                "message": "SAP ID already registered"
            }), 409

        # Create document with sanitized data
        document = {
            "name": name,
            "sap": sap,
            "email": email,
            "phone": phone,
            "orbit": orbit,
            "expectations": expectations,
            "hypId": hyp_id
        }

        collection.insert_one(document)

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 200

    except Exception as e:
        # Don't expose internal error details in production
        return jsonify({
            "success": False,
            "message": "Server error occurred"
        }), 500
