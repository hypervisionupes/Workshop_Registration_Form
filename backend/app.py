from flask import Flask, jsonify
from flask_cors import CORS
from routes.register_routes import register_bp
from routes.scan_routes import scan_bp
from routes.feedback_routes import feedback_bp
import config

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Register modular blueprints
app.register_blueprint(register_bp)
app.register_blueprint(scan_bp)
app.register_blueprint(feedback_bp)

@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Hypervision Workshop Registration API",
        "database": "Supabase"
    }), 200

if __name__ == "__main__":
    print(f"Starting Hypervision Backend on port {config.PORT}...")
    app.run(host="0.0.0.0", port=config.PORT, debug=True)
