import os
import chompjs, pandas as pd  # type: ignore
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder  # type: ignore
from sklearn.metrics.pairwise import cosine_similarity  # type: ignore
import scipy.sparse as sp  # type: ignore


class MLService:
    def __init__(self, data_js_path):
        js = open(data_js_path, encoding="utf-8").read()
        self.data = pd.DataFrame(chompjs.parse_js_object(js))

        # Multi-hot encode activities
        self.mlb_act = MultiLabelBinarizer()
        act_feat = self.mlb_act.fit_transform(self.data["activities"])

        # Join travelTypes and seasons as strings
        self.data["travelType_str"] = self.data["travelTypes"].apply(lambda lst: "|".join(lst))
        self.data["season_str"] = self.data["seasons"].apply(lambda lst: "|".join(lst))

        # One-hot encode travelType and season
        self.ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
        single_feat = self.ohe.fit_transform(self.data[["travelType_str", "season_str"]])

        # Save features (for full dataset)
        self.features = sp.hstack([single_feat, act_feat])

    def filter_data(self, df, prefs):
        travel_type = prefs.get("travelType")
        season = prefs.get("season")
        budget = prefs.get("budget")
        activities = prefs.get("interestedActivities", [])

        # Case-insensitive matching for travelType
        if travel_type:
            df = df[df["travelTypes"].apply(lambda x: travel_type.lower() in [t.lower() for t in x])]

        # Case-insensitive season match
        if season:
            df = df[df["seasons"].apply(lambda x: season.lower() in [s.lower() for s in x])]

        # Budget filter using budgetRange
        if budget is not None and "budgetRange" in df.columns:
            try:
                budget = int(budget)
                df = df[df["budgetRange"].apply(lambda r: isinstance(r, list) and len(r) == 2 and r[0] <= budget <= r[1])]
            except (ValueError, TypeError):
                pass

        # Case-insensitive activities match
        if activities:
            df = df[df["activities"].apply(lambda acts: any(a.lower() in [act.lower() for act in acts] for a in activities))]

        return df

    def recommend(self, prefs, top_n=3):
        df = self.data.copy()
        selected_state = prefs.get("state")

        # Normalize 'activity' string into 'interestedActivities'
        if "activity" in prefs and "interestedActivities" not in prefs:
            prefs["interestedActivities"] = [prefs["activity"]]

        # Step 1: Filter by state if given
        if selected_state:
            df = df[df["state"].str.lower() == selected_state.lower()]
            if df.empty:
                return []

        # Step 2: Apply advanced filters
        filtered_df = self.filter_data(df.copy(), prefs)

        if not filtered_df.empty:
            # Step 3: Compute similarity only on filtered data
            features = sp.hstack([
                self.ohe.transform(filtered_df[["travelType_str", "season_str"]]),
                self.mlb_act.transform(filtered_df["activities"])
            ])

            user_df = pd.DataFrame([{
                "travelType_str": prefs.get("travelType", ""),
                "season_str": prefs.get("season", "")
            }])
            user_feat = sp.hstack([
                self.ohe.transform(user_df),
                self.mlb_act.transform([prefs.get("interestedActivities", [])])
            ])

            sims = cosine_similarity(user_feat, features)[0]
            idxs = sims.argsort()[::-1][:top_n]
            return filtered_df.iloc[idxs].to_dict(orient="records")

        # Step 4: If no filtered results but state was selected, show top_n from that state
        if selected_state:
            return df.head(top_n).to_dict(orient="records")

        # Step 5: No results at all
        return []
