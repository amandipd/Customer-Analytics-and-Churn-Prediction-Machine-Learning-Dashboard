import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor
from backend.models.linear_regression import Linear_Regression
from backend.models.random_forest import Random_Forest
from backend.models.xgboost import XGBoost_Regression
import joblib
import os
from backend.churn import Churn

# ---------------------- Data Cleaning ---------------------- #


class Main:

    def __init__(self):
        """Read the CSV file, impute missing values in 'Satisfaction Level', and convert booleans to numeric."""
        csv_path = os.path.join(os.path.dirname(
            __file__), 'e-com_customer_behavior.csv')
        self.df = pd.read_csv(csv_path)

        # Impute missing values in 'Satisfaction Level
        most_common = self.df["Satisfaction Level"].mode()[0]
        self.df["Satisfaction Level"] = self.df["Satisfaction Level"].fillna(
            most_common)

        # Convert boolean column 'Discount Applied' to numeric
        self.df["Discount Applied"] = self.df["Discount Applied"].astype(int)
        self.standardization_params = {}  # Store means and stds for unstandardization
        self.df = self.encode_and_standardize_data(self.df)

    # ---------------------- Encoding & Standardization ---------------------- #

    def encode_and_standardize_data(self, df):
        """One-hot encode categorical columns and standardize numerical columns.
            clean_data must be called before this function is called"""

        # One hot encode categorical columns
        df = pd.get_dummies(
            df, columns=['Gender', 'City', 'Membership Type', 'Satisfaction Level'])

        dummy_columns = df.columns
        joblib.dump(dummy_columns, 'columns.pkl')

        columns_to_standardize = [
            "Age", "Items Purchased",
            "Average Rating", "Days Since Last Purchase"
        ]
        for col in columns_to_standardize:
            mean = df[col].mean()
            std = df[col].std()
            self.standardization_params[col] = {"mean": mean, "std": std}
            df[col] = (df[col] - mean) / std
        return df

    # ---------------------- Utility Methods ---------------------- #
    def get_df(self):
        return self.df

    def get_features_with_spend(self):
        """Get features for segmentation (excluding Customer ID)"""
        return [
            'Age', 'Total Spend', 'Items Purchased',
            'Average Rating', 'Discount Applied', 'Days Since Last Purchase',
            'Gender_Female', 'Gender_Male', 'City_Atlanta', 'City_Austin',
            'City_Boston', 'City_Chicago', 'City_Dallas', 'City_Denver',
            'City_Houston', 'City_Las Vegas', 'City_Los Angeles', 'City_Miami',
            'City_New York', 'City_Orlando', 'City_Philadelphia', 'City_Phoenix',
            'City_Portland', 'City_San Diego', 'City_San Francisco', 'City_Seattle',
            'Membership Type_Bronze', 'Membership Type_Gold',
            'Membership Type_Silver', 'Satisfaction Level_Neutral',
            'Satisfaction Level_Satisfied', 'Satisfaction Level_Unsatisfied'
        ]

    def get_features_without_spend(self):
        """Get features for segmentation (excluding Customer ID and Total Spend)"""
        return [
            'Age', 'Items Purchased',
            'Average Rating', 'Discount Applied', 'Days Since Last Purchase',
            'Gender_Female', 'Gender_Male', 'City_Atlanta', 'City_Austin',
            'City_Boston', 'City_Chicago', 'City_Dallas', 'City_Denver',
            'City_Houston', 'City_Las Vegas', 'City_Los Angeles', 'City_Miami',
            'City_New York', 'City_Orlando', 'City_Philadelphia', 'City_Phoenix',
            'City_Portland', 'City_San Diego', 'City_San Francisco', 'City_Seattle',
            'Membership Type_Bronze', 'Membership Type_Gold',
            'Membership Type_Silver', 'Satisfaction Level_Neutral',
            'Satisfaction Level_Satisfied', 'Satisfaction Level_Unsatisfied'
        ]

    def get_sample_user_input(self):
        """Get example user input for testing models with encoded features"""
        return {
            "Customer ID": 101,
            "Age": 29,
            "Total Spend": 1250.50,
            "Items Purchased": 14,
            "Average Rating": 4.6,
            "Discount Applied": 1,
            "Days Since Last Purchase": 25,
            "Gender_Female": 1,
            "Gender_Male": 0,
            "City_Atlanta": 0,
            "City_Austin": 0,
            "City_Boston": 0,
            "City_Chicago": 0,
            "City_Dallas": 0,
            "City_Denver": 0,
            "City_Houston": 0,
            "City_Las Vegas": 0,
            "City_Los Angeles": 0,
            "City_Miami": 0,
            "City_New York": 1,
            "City_Orlando": 0,
            "City_Philadelphia": 0,
            "City_Phoenix": 0,
            "City_Portland": 0,
            "City_San Diego": 0,
            "City_San Francisco": 0,
            "City_Seattle": 0,
            "Membership Type_Bronze": 0,
            "Membership Type_Gold": 1,
            "Membership Type_Silver": 0,
            "Satisfaction Level_Neutral": 0,
            "Satisfaction Level_Satisfied": 1,
            "Satisfaction Level_Unsatisfied": 0
        }

    def predict_user_input(self, model, user_data_dict, feature_columns):
        user_df = pd.DataFrame([user_data_dict])

   
        user_df = pd.get_dummies(user_df)

       
        for col in feature_columns:
            if col not in user_df.columns:
                user_df[col] = 0

        
        user_df = user_df[feature_columns]
        prediction = model.predict(user_df)[0]
        return prediction


def preprocess_user_input(user_input: dict, feature_columns: list) -> pd.DataFrame:
    rename_map = {
        "Average_Rating": "Average Rating",
        "Items_Purchased": "Items Purchased",
        "Discount_Applied": "Discount Applied",
        "Days_Since_Last_Purchase": "Days Since Last Purchase",
        "Membership_Type": "Membership Type",
        "Satisfaction_Level": "Satisfaction Level"
    }

    user_input = {rename_map.get(k, k): v for k, v in user_input.items()}
    df = pd.DataFrame([user_input])

    for col in ['Gender', 'City', 'Membership Type', 'Satisfaction Level']:
        if col in df.columns:
            df = pd.get_dummies(df, columns=[col])

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_columns]

    return df


# ---------------------- Main Execution ---------------------- #

def test_all_models(df):
    print("\n==================== TESTING ALL MODELS ====================\n")
    print("1. LINEAR REGRESSION MODEL:")
    lin_reg_test = Linear_Regression(df)
    lin_reg_test.linear_regression()
    lin_reg_test.evaluate_model()
    print("\n" + "-"*60 + "\n")

    print("2. RANDOM FOREST REGRESSOR:")
    rf_test = Random_Forest(df)
    rf_test.random_forest_regressor()
    rf_test.evaluate_model()
    print("\n" + "-"*60 + "\n")

    print("3. XGBOOST REGRESSION MODEL:")
    xgb = XGBoost_Regression(df)
    xgb.xgboost_regression()
    xgb.evaluate_model()
    print("\n==================== ALL MODELS TESTED ====================\n")


if __name__ == "__main__":
    
    main = Main()
    df = main.df

    print("\n==================== CHURN TESTS ====================\n")
    churn = Churn(df)
    print(f"Churn model accuracy on test set: {churn.accuracy:.2%}")
    print("First 5 rows with churn_risk column:")
    print(churn.df[["Days Since Last Purchase", 'churn_risk']].head())
    sample_customer = churn.df.iloc[0]
    risk = churn.predict_churn(sample_customer)
    print(
        f"\nSample customer Days Since Last Purchase: {sample_customer["Days Since Last Purchase"]}")
    print(f"Predicted churn risk (1=risk, 0=no risk): {risk}")
    print("\n==================== END CHURN TESTS ====================\n")


    '''
    lin_reg_test = Linear_Regression(df)
    lin_reg_test.linear_regression()
    lin_reg_test.evaluate_model()
    '''


    '''
    rf_test = Random_Forest(df)
    rf_test.random_forest_regressor()
    rf_test.evaluate_model()
    '''

    '''
    xgb = XGBoost_Regression(df)
    xgb.xgboost_regression()
    xgb.evaluate_model()
    '''
