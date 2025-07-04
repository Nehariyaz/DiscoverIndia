import os
from ml_service import MLService

# === STEP 1: Load the destination data ===
data_path = "../backend/data/destination.js"  # 🔁 Update this if the path is different

if not os.path.exists(data_path):
    raise FileNotFoundError(f"❌ File not found at: {data_path}")

ml = MLService(data_path)

# === STEP 2: Test preferences for 'yoga in monsoon with 5000 budget' ===
prefs = {
    # "state": "Assam",  # Optional: include or exclude to test both strict and relaxed matches
    "travelType": "solo",
    "budget": 5000,
    "season": "monsoon",
    "interestedActivities": ["yoga"]
}

# === STEP 3: Run recommendation ===
results = ml.recommend(prefs, top_n=5)

# === STEP 4: Print results ===
if results:
    print("✅ Yoga Destination Recommendations:")
    for r in results:
        print(f"- {r['name']} ({r['state']})")
        print(f"  🌧️ Season: {', '.join(r.get('seasons', []))}")
        print(f"  💰 Budget: {r.get('budgetRange', 'N/A')}")
        print(f"  🧘 Activities: {', '.join(r.get('activities', []))}")
        print(f"  🏷️ Tags: {', '.join(r.get('tags', []))}")
        print()
else:
    print("❌ No yoga destinations found matching your criteria.")
