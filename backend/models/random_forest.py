from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64


class Random_Forest:

    def __init__(self, df):
        self.df = df
        self.rf_model = None
        self.feature_columns = None
        self.y_test = None
        self.y_pred = None

    def random_forest_regressor(self):
        '''
        How Random Forest Regression works:
        - Multiple trees are trained on bootstrapped subsets of data (random samples with replacement)
        - Each tree is a regression decision tree -- learns how to predict continuous numeric values
        - each tree gives its own numeric prediction
        - final output is the average of all tree outputs
        '''
        X = self.df.drop(columns=["Customer ID", "Total Spend"])
        y = self.df['Total Spend']

        # Store feature columns for later use
        self.feature_columns = X.columns.tolist()

        X_train, X_test, y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)

        self.rf_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.rf_model.fit(X_train, y_train)
        self.y_pred = self.rf_model.predict(X_test)
        return self.rf_model

    def evaluate_model(self):
        if self.y_test is None or self.y_pred is None:
            raise ValueError(
                "Model must be trained first. Call random_forest_regressor().")

        mse = mean_squared_error(self.y_test, self.y_pred)
        r2 = r2_score(self.y_test, self.y_pred)
        rmse = np.sqrt(mse)
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R^2 Score: {r2:.4f}")
        print(f"RMSE: {rmse:.2f}")

    def get_stats(self):
        if self.y_test is None or self.y_pred is None:
            raise ValueError(
                "Model must be trained first. Call random_forest_regressor().")

        r2 = r2_score(self.y_test, self.y_pred)
        mae = mean_absolute_error(self.y_test, self.y_pred)
        rmse = np.sqrt(mean_squared_error(self.y_test, self.y_pred))
        return {
            "r2": r2,
            "mae": mae,
            "rmse": rmse
        }

    def predict(self, input_data):
        if self.rf_model is None:
            raise ValueError(
                "Model must be trained first. Call random_forest_regressor().")
        return self.rf_model.predict(input_data)

    def plot_residuals(self):
        if self.y_test is None or self.y_pred is None:
            raise ValueError("Model must be trained first.")
        residuals = self.y_test - self.y_pred

        plt.figure(figsize=(6, 4))
        plt.scatter(self.y_pred, residuals, alpha=0.6)
        plt.axhline(0, color='red', linestyle='--')
        plt.xlabel("Predicted Values")
        plt.ylabel("Residuals")
        plt.title("Residual Plot (Random Forest)")
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return img_base64
