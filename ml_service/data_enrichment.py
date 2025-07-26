# data_enrichment.py

import numpy as np # type: ignore

def normalize_column(df, col):
    """
    Normalize a column to the [0, 1] range, if it exists and has more than one unique value.
    Adds a new column 'norm_{col}' to the DataFrame.
    """
    norm_col = f"norm_{col}"
    if col in df.columns and df[col].notnull().sum() > 1:
        col_min = df[col].min()
        col_max = df[col].max()
        if col_max > col_min:
            df[norm_col] = (df[col] - col_min) / (col_max - col_min)
        else:
            df[norm_col] = 0.0  # or np.nan if you prefer
    return df

def budget_overlap(user_budget, dest_budget):
    """
    Returns True if user's budget range and destination's budget overlap.
    Both budgets should be (min, max) or [min, max] list/tuple.
    Handles missing/invalid data by returning False.
    """
    try:
        if not (isinstance(user_budget, (list, tuple)) and len(user_budget) == 2):
            return False
        if not (isinstance(dest_budget, (list, tuple)) and len(dest_budget) == 2):
            return False
        # Convert all to numbers
        umin, umax = float(user_budget[0]), float(user_budget[1])
        dmin, dmax = float(dest_budget[0]), float(dest_budget[1])
        return not (umax < dmin or umin > dmax)
    except Exception:
        return False
