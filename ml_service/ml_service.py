import os
import chompjs, pandas as pd  # type: ignore
import scipy.sparse as sp  # type: ignore
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder  # type: ignore
from sklearn.metrics.pairwise import cosine_similarity  # type: ignore
from sentence_transformers import SentenceTransformer, util  # type: ignore
import math


class MLService:
    def __init__(self, data_js_path):
        js = open(data_js_path, encoding="utf-8").read()
        self.data = pd.DataFrame(chompjs.parse_js_object(js))

        # Prepare features
        self.mlb_act = MultiLabelBinarizer()
        self.data["activities"] = self.data["activities"].apply(lambda x: [a.strip() for a in x])
        self.data["travelType_str"] = self.data["travelTypes"].apply(lambda lst: "|".join(lst))
        self.data["season_str"] = self.data["seasons"].apply(lambda lst: "|".join(lst))

        self.ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=True)
        self.ohe_feat = self.ohe.fit_transform(self.data[["travelType_str", "season_str"]])
        self.act_feat = self.mlb_act.fit_transform(self.data["activities"])

        # Sentence embedding for activities
        self.activity_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.unique_acts = self.mlb_act.classes_
        self.activity_embeddings = self.activity_model.encode(self.unique_acts, convert_to_tensor=True)

        # Save full feature matrix (unweighted for now)
        self.features = sp.hstack([self.ohe_feat, self.act_feat])

    def fuzzy_match_activities(self, user_activities, top_k=3, min_score=0.5):
        if not user_activities:
            return []

        matched = set()
        for act in user_activities:
            query_embed = self.activity_model.encode(act, convert_to_tensor=True)
            sim_scores = util.cos_sim(query_embed, self.activity_embeddings)[0]
            top_indices = sim_scores.argsort(descending=True)

            for idx in top_indices:
                score = sim_scores[idx].item()
                if score < min_score:
                    break
                matched.add(self.unique_acts[idx])
                if len(matched) >= top_k:
                    break

        matched_list = list(matched)
        print(f"User activity input: {user_activities}")
        print(f"Matched activities used for filtering: {matched_list}")
        return matched_list

    def filter_data(self, df: pd.DataFrame, prefs: dict) -> pd.DataFrame:
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

        if activities:
            matched_activities = self.fuzzy_match_activities(activities)
            if "activities" in df.columns:
                df = df[df["activities"].apply(lambda acts: any(act in matched_activities for act in acts))]
            else:
                print("Warning: 'activities' column missing in filtered dataframe.")

        return df

    def recommend(self, prefs: dict, top_n: int = 3) -> list:
        print("Incoming preferences:", prefs)
        full_df = self.data.copy()

        if "activity" in prefs and "interestedActivities" not in prefs:
            prefs["interestedActivities"] = [prefs["activity"]]

        selected_state = prefs.get("state")
        df = full_df

        if selected_state:
            df = df[df["state"].str.strip().str.lower() == selected_state.strip().lower()]
            if df.empty:
                print("No destinations found in the selected state. Falling back to full dataset.")
                df = full_df

        filtered_df = self.filter_data(df.copy(), prefs)
        print(f"Filtered destinations: {len(filtered_df)}")

        if not filtered_df.empty:
            return self._rank_by_similarity(filtered_df, prefs, top_n)

        print("No direct matches found after filtering. Using fallback recommendations from full dataset.")
        return self._rank_by_similarity(full_df, prefs, top_n)

    def _rank_by_similarity(self, df: pd.DataFrame, prefs: dict, top_n: int) -> list:
        try:
            weights = {
                "travel": 2.0,
                "season": 1.5,
                "activity": 3.0
            }

            user_df = pd.DataFrame([{
                "travelType_str": prefs.get("travelType", ""),
                "season_str": prefs.get("season", "")
            }])

            user_ohe = self.ohe.transform(user_df)
            user_act = self.mlb_act.transform([self.fuzzy_match_activities(prefs.get("interestedActivities", []))])

            travel_feat = user_ohe[:, :len(self.ohe.categories_[0])]
            season_feat = user_ohe[:, len(self.ohe.categories_[0]):]

            user_vector = sp.hstack([
                travel_feat.multiply(weights["travel"]),
                season_feat.multiply(weights["season"]),
                sp.csr_matrix(user_act).multiply(weights["activity"])
            ])

            dataset_ohe = self.ohe.transform(df[["travelType_str", "season_str"]])
            travel_feat_ds = dataset_ohe[:, :len(self.ohe.categories_[0])]
            season_feat_ds = dataset_ohe[:, len(self.ohe.categories_[0]):]
            activity_feat_ds = self.mlb_act.transform(df["activities"])

            dataset_vector = sp.hstack([
                travel_feat_ds.multiply(weights["travel"]),
                season_feat_ds.multiply(weights["season"]),
                sp.csr_matrix(activity_feat_ds).multiply(weights["activity"])
            ])

            sims = cosine_similarity(user_vector, dataset_vector)[0]
            top_indices = sims.argsort()[::-1][:top_n]

            def clean_record(record):
                return {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in record.items()}

            results = [clean_record(r) for r in df.iloc[top_indices].to_dict(orient="records")]
            print(f"Top {top_n} results:", [r["name"] for r in results])
            return results

        except Exception as e:
            print("Similarity ranking failed:", e)
            return df.head(top_n).to_dict(orient="records")
