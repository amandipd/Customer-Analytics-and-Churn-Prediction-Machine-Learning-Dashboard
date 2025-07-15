from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from xgboost import XGBRegressor
import numpy as np
import matplotlib.pyplot as plt
import io
import base64


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

    def get_stats(self):
        r2 = r2_score(self.y_test, self.y_pred)
        mae = mean_absolute_error(self.y_test, self.y_pred)
        rmse = np.sqrt(mean_squared_error(self.y_test, self.y_pred))
        return {
            "r2": r2,
            "mae": mae,
            "rmse": rmse
        }

    def plot_residuals(self):
        y_true = self.y_test
        y_pred = self.model.predict(self.X_test)
        residuals = y_true - y_pred

        plt.figure(figsize=(6, 4))
        plt.scatter(y_pred, residuals, alpha=0.6)
        plt.axhline(0, color='red', linestyle='--')
        plt.xlabel("Predicted Values")
        plt.ylabel("Residuals")
        plt.title("Residual Plot (XGBoost)")
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return img_base64
