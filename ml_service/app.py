import os
import math
import numpy as np  # type: ignore
import pandas as pd  # type: ignore
from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from ml_service import MLService

app = Flask(__name__)

# Configure CORS to allow Angular frontend origin
CORS(app, origins=["http://localhost:4200"],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"])

# Optional: Add CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# NaN sanitizer function for JSON output
def clean_nan_dict(record):
    return {
        k: (None if isinstance(v, float) and math.isnan(v) else v)
        for k, v in record.items()
    }

# Load dataset path
base_dir = os.path.abspath(os.path.dirname(__file__))
data_js = os.path.abspath(os.path.join(base_dir, '..', 'backend', 'data', 'destination.js'))
print("Loading dataset from:", data_js)

# Initialize MLService
ml = MLService(data_js)

# API route for recommendations
@app.route("/api/recommendations", methods=["POST"])
def recommend():
    prefs = request.get_json()
    print("Received preferences:", prefs)

    recs = ml.recommend(prefs, top_n=5)

    # Clean output: replace NaN with None
    if isinstance(recs, list) and all(isinstance(r, dict) for r in recs):
        recs = [clean_nan_dict(r) for r in recs]

    elif isinstance(recs, list) and all(isinstance(r, str) for r in recs):
        recs = [{"name": r} for r in recs]

    return jsonify(recs)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
