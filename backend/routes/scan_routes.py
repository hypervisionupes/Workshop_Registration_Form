from flask import Blueprint, request, jsonify
from database import get_supabase

scan_bp = Blueprint("scan", __name__)

@scan_bp.route("/scan-qr", methods=["POST"])
def scan_qr():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "message": "Invalid QR data"
            }), 400

        sap_id = str(data.get("sapId") or data.get("sap") or "").strip()
        if not sap_id:
            return jsonify({
                "success": False,
                "message": "SAP ID is required in QR payload"
            }), 400

        supabase = get_supabase()

        # Check if already scanned
        attendance_check = supabase.table("attendance").select("sap_id").eq("sap_id", sap_id).execute()
        if attendance_check.data and len(attendance_check.data) > 0:
            return jsonify({
                "success": False,
                "message": "QR already scanned"
            }), 409

        # Check registration record
        user_check = supabase.table("workshop_registration").select("*").eq("sap", sap_id).execute()
        if not user_check.data or len(user_check.data) == 0:
            return jsonify({
                "success": False,
                "message": "Registration not found for this SAP ID"
            }), 400

        # Mark attendance in attendance table
        supabase.table("attendance").insert({"sap_id": sap_id}).execute()

        # Mark attended flag in workshop_registration
        supabase.table("workshop_registration").update({"attended": True}).eq("sap", sap_id).execute()

        return jsonify({
            "success": True,
            "message": "Attendance marked successfully"
        }), 200

    except Exception as e:
        print("Scan QR error:", e)
        return jsonify({
            "success": False,
            "message": "Server error occurred while scanning QR"
        }), 500
