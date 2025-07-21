import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


class Churn:
    def __init__(self, df):
        self.df = df.copy()
        self.df['churn_risk'] = (
            self.df['Days Since Last Purchase'] > 45).astype(int)

        X = self.df.drop(
            columns=["Customer ID", "churn_risk"], errors='ignore')
        y = self.df['churn_risk']

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(self.X_train, self.y_train)

        y_pred = self.model.predict(self.X_test)
        self.accuracy = accuracy_score(self.y_test, y_pred)

    def predict_churn(self, customer_row: pd.Series) -> int:
        """
        Predict if a customer is at risk of churning using the trained Random Forest model.
        Returns 1 if at risk, 0 otherwise.
        """

        X_new = customer_row.drop(
            labels=["Customer ID", "churn_risk"], errors='ignore').to_frame().T
        return int(self.model.predict(X_new)[0])
