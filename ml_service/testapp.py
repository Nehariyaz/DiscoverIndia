import os
from ml_service import MLService
import math


# === STEP 1: Load the destination data ===
data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', 'data', 'destination.js'))

if not os.path.exists(data_path):
    raise FileNotFoundError(f"File not found at: {data_path}")

print(f"Loading dataset from: {data_path}")

ml = MLService(data_path)

# === STEP 2: Test preferences for 'yoga in monsoon with 5000 budget' ===
prefs = {
    # "state": "Assam",  # Optional: uncomment to test strict state filtering
    "travelType": "solo",
    "budget": 5000,
    "season": "monsoon",
    "interestedActivities": ["yoga"]
}

print("Testing with preferences:")
for k, v in prefs.items():
    print(f"  {k}: {v}")

# === STEP 3: Run recommendation ===
results = ml.recommend(prefs, top_n=5)

# === STEP 4: Print results ===
if results:
    print("\nYoga Destination Recommendations:")
    for r in results:
        print(f"- {r.get('name', 'Unknown')} ({r.get('state', 'Unknown')})")
        print(f"  🌧️ Seasons: {', '.join(r.get('seasons', [])) if r.get('seasons') else 'N/A'}")
        print(f"  💰 Budget: {r.get('budgetRange', 'N/A')}")
        print(f"  🧘 Activities: {', '.join(r.get('activities', [])) if r.get('activities') else 'N/A'}")

        tags = r.get('tags')
        if isinstance(tags, (list, tuple)):
            tags_str = ', '.join(tags)
        else:
            tags_str = str(tags) if tags else 'N/A'
        print(f"  🏷️ Tags: {tags_str}\n")
else:
    print("\nNo yoga destinations found matching your criteria.")
