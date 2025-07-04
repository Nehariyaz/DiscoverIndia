import os
import chompjs, pandas as pd  # type: ignore
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder  # type: ignore
from sklearn.metrics.pairwise import cosine_similarity  # type: ignore
import scipy.sparse as sp  # type: ignore

class MLService:
    def __init__(self, data_js_path):
        js = open(data_js_path, encoding="utf-8").read()
        self.data = pd.DataFrame(chompjs.parse_js_object(js))

        # One-hot encode activities
        self.mlb_act = MultiLabelBinarizer()
        act_feat = self.mlb_act.fit_transform(self.data["activities"])

        # Convert travelTypes and seasons to strings
        self.data["travelType_str"] = self.data["travelTypes"].apply(lambda lst: "|".join(lst))
        self.data["season_str"] = self.data["seasons"].apply(lambda lst: "|".join(lst))

        self.ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
        ohe_feat = self.ohe.fit_transform(self.data[["travelType_str", "season_str"]])

        self.features = sp.hstack([ohe_feat, act_feat])

    def filter_data(self, df: pd.DataFrame, prefs: dict) -> pd.DataFrame:
        """Filter the data based on travelType, season, budget, and activities."""
        travel_type = prefs.get("travelType")
        season = prefs.get("season")
        budget = prefs.get("budget")
        activities = prefs.get("interestedActivities", [])

        if travel_type:
            df = df[df["travelTypes"].apply(lambda x: travel_type.lower() in [t.lower() for t in x])]

        if season:
            df = df[df["seasons"].apply(lambda x: season.lower() in [s.lower() for s in x])]

        if budget is not None and "budgetRange" in df.columns:
            try:
                budget = int(budget)
                df = df[df["budgetRange"].apply(lambda r: isinstance(r, list) and len(r) == 2 and r[0] <= budget <= r[1])]
            except Exception:
                pass

        # Relaxed activity matching
        if activities:
            df = df[df["activities"].apply(
                lambda acts: any(
                    a.lower() in act.lower() or act.lower() in a.lower()
                    for act in acts for a in activities
                )
            )]

        return df

    def recommend(self, prefs: dict, top_n: int = 3) -> list:
        print("Incoming preferences:", prefs)
        df = self.data.copy()

        # Normalize activity
        if "activity" in prefs and "interestedActivities" not in prefs:
            prefs["interestedActivities"] = [prefs["activity"]]

        selected_state = prefs.get("state")
        if selected_state:
            df = df[df["state"].str.lower() == selected_state.lower()]
            if df.empty:
                print("No destinations found in the selected state.")
                return []

        filtered_df = self.filter_data(df.copy(), prefs)
        print(f"Filtered destinations: {len(filtered_df)}")

        if not filtered_df.empty:
            return self._rank_by_similarity(filtered_df, prefs, top_n)

        # Relaxed fallback: return top_n from same state or overall
        print("No direct matches found. Using fallback.")
        fallback_df = df if selected_state else self.data
        return self._rank_by_similarity(fallback_df, prefs, top_n)

    def _rank_by_similarity(self, df: pd.DataFrame, prefs: dict, top_n: int) -> list:
        try:
            features = sp.hstack([
                self.ohe.transform(df[["travelType_str", "season_str"]]),
                self.mlb_act.transform(df["activities"])
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
            top_indices = sims.argsort()[::-1][:top_n]
            results = df.iloc[top_indices].to_dict(orient="records")
            print(f"Top {top_n} results after similarity ranking:", [r["name"] for r in results])
            return results

        except Exception as e:
            print("Similarity ranking failed:", e)
            return df.head(top_n).to_dict(orient="records")
