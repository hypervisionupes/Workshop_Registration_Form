import re
from flask import Blueprint, request, jsonify
from database import get_supabase
from utils.sanitizer import sanitize_string
from services.qr_service import gen_qr

register_bp = Blueprint("register", __name__)

@register_bp.route("/register", methods=["POST"])
def register():
    try:
        supabase = get_supabase()
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400

        required_fields = ["name", "sap", "email", "phone", "orbit", "expectations"]

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
        if not re.fullmatch(r"(500\d{6}|5900\d{5})", sap):
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

        # Duplicate checks in Supabase
        sap_check = supabase.table("workshop_registration").select("sap").eq("sap", sap).execute()
        if sap_check.data and len(sap_check.data) > 0:
            return jsonify({
                "success": False,
                "message": "SAP ID already registered"
            }), 409

        email_check = supabase.table("workshop_registration").select("email").eq("email", email).execute()
        if email_check.data and len(email_check.data) > 0:
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 409

        phone_check = supabase.table("workshop_registration").select("phone").eq("phone", phone).execute()
        if phone_check.data and len(phone_check.data) > 0:
            return jsonify({
                "success": False,
                "message": "Phone number already registered"
            }), 409

        # Insert new registration record into Supabase
        record = {
            "name": name,
            "sap": sap,
            "email": email,
            "phone": phone,
            "orbit": orbit,
            "expectations": expectations,
            "attended": False
        }
        supabase.table("workshop_registration").insert(record).execute()

        # Generate QR code and trigger Resend email service
        try:
            gen_qr(record)
        except Exception as email_err:
            print("Warning: Email/QR service error:", email_err)

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 200

    except Exception as e:
        err_msg = str(e)
        print("Registration error:", err_msg)
        if "PGRST205" in err_msg or "schema cache" in err_msg:
            return jsonify({
                "success": False,
                "message": "Database table 'workshop_registration' not found. Please run backend/schema.sql in your Supabase SQL editor."
            }), 500

        return jsonify({
            "success": False,
            "message": "Server error occurred. Please check database configuration."
        }), 500
