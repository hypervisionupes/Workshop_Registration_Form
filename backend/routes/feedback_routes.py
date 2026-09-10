from flask import Blueprint, request, jsonify
from database import get_supabase
from utils.sanitizer import sanitize_string

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods=["POST"])
def post_feedback():
    try:
        data = request.get_json()
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "message": "Invalid request data"
            }), 400

        name = sanitize_string(data.get("name"), max_length=100)
        sap = str(data.get("sap") or data.get("hypervisionId") or "").strip()
        ratings = data.get("ratings") or []
        feedback_text = sanitize_string(data.get("feedback"), max_length=1500)

        if len(name) < 2:
            return jsonify({
                "success": False,
                "message": "Name must be at least 2 characters"
            }), 400

        if not ratings or not isinstance(ratings, list):
            return jsonify({
                "success": False,
                "message": "Ratings are required"
            }), 400

        # Calculate average rating
        total_rating = sum(float(r) for r in ratings)
        avg_rating = round(total_rating / len(ratings), 2) if len(ratings) > 0 else 0

        supabase = get_supabase()

        document = {
            "name": name,
            "sap": sap,
            "ratings": ratings,
            "avg_rating": avg_rating,
            "feedback": feedback_text
        }

        supabase.table("workshop_feedback").insert(document).execute()

        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully"
        }), 200

    except Exception as e:
        print("Feedback submission error:", e)
        return jsonify({
            "success": False,
            "message": "Server error occurred while saving feedback"
        }), 500
