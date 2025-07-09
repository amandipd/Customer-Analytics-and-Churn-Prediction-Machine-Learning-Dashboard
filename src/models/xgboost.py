from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor
import numpy as np


class XGBoost_Regression:
    def __init__(self, df):
        self.df = df

    def xgboost_regression(self):
        X = self.df.drop(columns=["Customer ID", "Total Spend"])
        y = self.df['Total Spend']

        X_train, X_test, y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)
        self.model = XGBRegressor(n_estimators=100, learning_rate=0.1,
                                  max_depth=4, random_state=42)
        self.model.fit(X_train, y_train)
        self.y_pred = self.model.predict(X_test)
        self.feature_columns = X.columns
        return self.model

    def evaluate_model(self):
        print("----------------------------XGBOOST RESULTS----------------------------")
        print("R^2 score:", r2_score(self.y_test, self.y_pred))
        print("Mean Squared Error:", mean_squared_error(self.y_test, self.y_pred))
        rmse = np.sqrt(mean_squared_error(self.y_test, self.y_pred))
        print(f"RMSE: {rmse}")
