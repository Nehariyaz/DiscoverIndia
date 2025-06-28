import os
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from ml_service import MLService

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"])


base_dir = os.path.abspath(os.path.dirname(__file__))
data_js = os.path.abspath(os.path.join(base_dir, '..', 'backend', 'data', 'destination.js'))
print("Loading dataset from:", data_js)

ml = MLService(data_js)

@app.route("/api/recommendations", methods=["POST"])
def recommend():
    prefs = request.get_json()
    print("ML received preferences:", prefs)
    recs = ml.recommend(prefs, top_n=5)
    print("ML output:", recs)
    return jsonify(recs)
    

if __name__ == "__main__":
    app.run(port=5001)