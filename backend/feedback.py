from flask import request,jsonify
from database import get_db
from postdata import sanitize_string
import re
from datetime import datetime

def postfeedback():
    try:
        db=get_db()
        collection=db["Workshop_feedback"]
        data=request.get_json()
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400
        required_fields=["name","sap","hypervisionId","year","feedback"]
        for field in required_fields:
            if not data[field]:
                return jsonify({"Success" : False,
                                "message":f"{field} is required"}),400

        name = sanitize_string(data["name"], max_length=100)
        sap = str(data["sap"]).strip()
        year = str(data["year"]).strip()
        feedback = sanitize_string(data["feedback"], max_length=5000)
        hyp_id = str(data["hypervisionId"]).strip().upper()

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

        # Validate SAP ID (can start with 5000 or 5900)
        if not re.fullmatch(r"(5000|5900)\d{5}", sap):
            return jsonify({
                "success": False,
                "message": "SAP ID must be 9 digits and start with 5000 or 5900"
            }), 400

        # Validate year (year)
        if year not in ["1", "2", "3", "4"]:
            return jsonify({
                "success": False,
                "message": "Invalid year selection"
            }), 400

        if len(feedback) < 5:
            return jsonify({
                "success": False,
                "message": "Feedback must be at least 5 characters"
            }), 400
        
        if len(feedback) > 5000:
            return jsonify({
                "success": False,
                "message": "Feedback must not exceed 5000 characters"
            }), 400

        if not re.fullmatch(r"HYPE\d{4}", hyp_id):
            return jsonify({
                "success": False,
                "message": "Hypervision ID must be in format HYPE1234"
            }), 400
        hypervision_collection=db["hypervision_members"]
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
        
        document={
            "name":name,
            "sapId":sap,
            "hypeid":hyp_id,
            "year":year,
            "feedback":feedback,
            "submittedAt":datetime.utcnow()
        }
        collection.insert_one(document)
        return jsonify({
            "success":True,
            "message":"Feedback submitted successfully"
        })


    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Server error occurred"
        }), 500