# recommend_service.py
import os
import json
import math
from ml_service import MLService

# === Load dataset once ===
DATA_FILE = os.path.join(os.path.dirname(__file__), "destination.js")
ml_service = MLService(DATA_FILE)

# === Utility for cleaning NaN ===
def clean_nan_dict(record):
    return {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in record.items()}


# === Lambda Handlers ===
def recommend_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        recommendations = ml_service.recommend(body, top_n=5)

        if isinstance(recommendations, list) and all(isinstance(r, dict) for r in recommendations):
            recommendations = [clean_nan_dict(r) for r in recommendations]

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": os.getenv("FRONTEND_URL", "*"),
                "Access-Control-Allow-Credentials": True,
            },
            "body": json.dumps(recommendations),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }

def health_handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": os.getenv("FRONTEND_URL", "*"),
            "Access-Control-Allow-Credentials": True,
        },
        "body": json.dumps({"status": "ok"}),
    }


# === Flask (only runs locally, not in Lambda) ===
if __name__ == "__main__":
    try:
        from flask import Flask, request, jsonify  # type: ignore
        from flask_cors import CORS  # type: ignore

        app = Flask(__name__)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:4200")

        CORS(app, origins=[frontend_url], supports_credentials=True, methods=["GET", "POST", "OPTIONS"])

        @app.route("/api/recommendations", methods=["POST", "OPTIONS"])
        def recommend_api():
            prefs = request.get_json()
            recs = ml_service.recommend(prefs, top_n=5)

            if isinstance(recs, list) and all(isinstance(r, dict) for r in recs):
                recs = [clean_nan_dict(r) for r in recs]
            elif isinstance(recs, list) and all(isinstance(r, str) for r in recs):
                recs = [{"name": r} for r in recs]

            return jsonify(recs)

        app.run(host="0.0.0.0", port=5001, debug=True)
    except ImportError:
        # Flask is not required on Lambda
        pass
