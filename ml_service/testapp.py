from ml_service import MLService

# Load the model with your destination.js
ml = MLService("../backend/data/destination.js")

# Test preferences for filtering
prefs = {
    "state": "Rajasthan",
    "travelType": "heritage",
    "budget": 6000,
    "season": "winter",
    "interestedActivities": ["fort tour"]
}

# Run the recommendation
results = ml.recommend(prefs, top_n=5)

# Display results
print("Recommendations:")
for r in results:
    print(f"- {r['name']} ({r['state']}) | Budget: {r['budgetRange']} | Activities: {r['activities']}")
