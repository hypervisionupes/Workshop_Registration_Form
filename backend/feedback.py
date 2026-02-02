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
        avg_rating=0
        for rating in data["ratings"]:
                avg_rating+=rating
        avg_rating=f"{avg_rating/7:.3f}"
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400
        required_fields=["name","hypervisionId"]
        for field in required_fields:
            if not data[field]:
                return jsonify({"Success" : False,
                                "message":f"{field} is required"}),400

        name = sanitize_string(data["name"], max_length=100)
        feedback = sanitize_string(data["feedback"], max_length=5000)
        hyp_id = str(data["hypervisionId"]).strip().upper()
        rating=data["ratings"]

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

        if len(feedback) < 5:
            return jsonify({
                "success": False,
                "message": "Feedback must be at least 5 characters"
            }), 400

        if len(feedback) > 1500:
            return jsonify({
                "success": False,
                "message": "Feedback must not exceed 1500 characters"
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
        # Check if feedback already exists for this Hypervision ID
        existing_feedback = collection.find_one({"hypeid": hyp_id})

        if existing_feedback:
            return jsonify({
                "success": False,
                "message": "Feedback has already been submitted for this Hypervision ID"
            }), 409

        document={
            "name":name,
            "hypeid":hyp_id,
            "ratings":rating,
            "avgrating":avg_rating,
            "feedback":feedback,
            "submittedAt":datetime.utcnow()
        }
        collection.insert_one(document)
        return jsonify({
            "success":True,
            "message":"Feedback submitted successfully"
        })


    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "Server error occurred"
        }), 500