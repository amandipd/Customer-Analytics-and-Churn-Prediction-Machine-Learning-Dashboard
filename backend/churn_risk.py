import numpy as np
import pandas as pd


class Churn_Risk:

    def __init__(self, df):
        self.df = df
        self.clean_and_org_data()
        # Adding a binary churn_risk column, and assigning 1 if days_since_last_purcahse is > 45
        df['churn_risk'] = df['Days Since Last Purchase'].apply(
            lambda x: 1 if x > 44 else 0)
        print(df.toList())
