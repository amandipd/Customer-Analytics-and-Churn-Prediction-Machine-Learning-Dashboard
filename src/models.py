import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor


class Models:

    def __init__(self, df):
        self.df = df

    def linear_regression(self):
        X = self.df.drop(columns=['Customer ID', 'Total Spend'])
        y = self.df['Total Spend']

        # Identify categorical and numeric columns
        categorical_cols = X.select_dtypes(
            include=['object', 'category']).columns.tolist()
        numeric_cols = X.select_dtypes(
            include=['int64', 'float64']).columns.tolist()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        feature_columns = X.columns

        # Evaluating Model and Coefficents
        print("----------------------------LIN REG RESULTS----------------------------")
        print("R^2 score:", r2_score(y_test, y_pred))
        print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        print(f"RMSE: {rmse}")
        print("Intercept:", model.intercept_)
        print("Coefficients:", list(zip(X.columns, model.coef_)))
        return [model, feature_columns]

    def random_forest_regressor(self):
        """
        How Random Forest Regression works:
        - Multiple trees are trained on bootstrapped subsets of data (random samples with replacement)
        - Each tree is a regression desicion tree -- learns how to predict continuous numeric values
        - each tree gives its own numeric prediction
        - final output is the average of all tree outputs
        """
        X = self.df.drop(columns=["Customer ID", "Total Spend"])
        y = self.df['Total Spend']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)

        rf_model = RandomForestRegressor(n_estimators=50, random_state=42)
        rf_model.fit(X_train, y_train)
        y_pred = rf_model.predict(X_test)

        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mse)
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R^2 Score: {r2:.4f}")
        print(f"RMSE: {rmse:.2f}")

    def xgboost(self):
        X = self.df.drop(columns=["Customer ID", "Total Spend"])
        y = self.df['Total Spend']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)
        model = XGBRegressor(n_estimators=100, learning_rate=0.1,
                             max_depth=4, random_state=42)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mse)
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R^2 Score: {r2:.4f}")
        print(f"RMSE: {rmse:.2f}")

    # ---------------------- Prediction Utility ---------------------- #

    def predict_user_input(self, model, user_data_dict, feature_columns):
        user_df = pd.DataFrame([user_data_dict])

        # Applying one-hot encoding
        user_df = pd.get_dummies(user_df)

        # Ensuring all columns are present
        for col in feature_columns:
            if col not in user_df.columns:
                user_df[col] = 0

        # reorder columns to match training data
        user_df = user_df[feature_columns]

        prediction = model.predict(user_df)[0]
        return prediction

    # ---------------------- Test Function ---------------------- #

    def test_all_models(self):
        """
        Test function that runs all three models and prints their outputs
        """
        print("=" * 80)
        print("TESTING ALL MODELS")
        print("=" * 80)

        # Test Linear Regression
        print("\n1. LINEAR REGRESSION MODEL:")
        print("-" * 40)
        linear_model, feature_columns = self.linear_regression()
        print(f"Model type: {type(linear_model)}")
        print(f"Feature columns count: {len(feature_columns)}")

        # Test Random Forest
        print("\n2. RANDOM FOREST REGRESSOR:")
        print("-" * 40)
        self.random_forest_regressor()

        # Test XGBoost
        print("\n3. XGBOOST MODEL:")
        print("-" * 40)
        self.xgboost()

        print("\n" + "=" * 80)
        print("ALL MODELS TESTED SUCCESSFULLY")
        print("=" * 80)

        return {
            'linear_model': linear_model,
            'feature_columns': feature_columns
        }
