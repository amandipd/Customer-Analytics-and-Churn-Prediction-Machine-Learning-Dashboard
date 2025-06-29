import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor
from segmentation import Segmentation
from churn_risk import Churn_Risk
from models import Models
import joblib

# ---------------------- Data Cleaning ---------------------- #


class Main:

    def __init__(self):
        self.churn_df = self.clean_data()
        # self.days_since_purchase = self.df['Days Since Last Purchase']
        self.df = self.encode_and_standardize_data(self.churn_df)

    def clean_data(self):
        """Read the CSV file, impute missing values in 'Satisfaction Level', and convert booleans to numeric."""
        df = pd.read_csv('../e-com_customer_behavior.csv')

        # Impute missing values in 'Satisfaction Level'
        most_common = df["Satisfaction Level"].mode()[0]
        df["Satisfaction Level"] = df["Satisfaction Level"].fillna(most_common)

        # Convert boolean column 'Discount Applied' to numeric
        df["Discount Applied"] = df["Discount Applied"].astype(int)

        return df

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
            df[col] = (df[col] - mean) / std
        return df

    # ---------------------- Utility Methods ---------------------- #

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
        """Get example user input for testing models"""
        return {
            "Customer ID": 101,
            "Gender": "Female",
            "Age": 29,
            "City": "New York",
            "Membership Type": "Gold",
            "Items Purchased": 14,
            "Average Rating": 4.6,
            "Discount Applied": "TRUE",
            "Days Since Last Purchase": 25,
            "Satisfaction Level": "Satisfied"
        }

    def get_churn_risk(self):
        churn = Churn_Risk(self.churn_df)
        churn.print_df()


# ---------------------- Main Execution ---------------------- #

if __name__ == "__main__":
    # Initialize the main class
    main = Main()

    # Get the processed dataframe
    df = main.df

    main.get_churn_risk()
    # print("hello")

    # models = Models(df)
    # models.test_all_models()

    # print("Data shape:", df.shape)
    # print("Columns:", list(df.columns))
    # print("\nFirst few rows:")
    # print(df.head())

    # Example user input for testing models
    # user_input = main.get_sample_user_input()

    # Features for segmentation
    # features_with_spend = main.get_features_with_spend()
    # features_without_spend = main.get_features_without_spend()

    # Uncomment below to test models
    # model_and_features = main.linear_regression(df)
    # lin_reg_model = model_and_features[0]
    # feature_columns = model_and_features[1]

    # main.random_forest_regressor(df)
    # main.xgboost(df)

    # print(main.predict_user_input(lin_reg_model, user_input, feature_columns))

    # Segmentation Example
    # seg = Segmentation(df)
    # test = seg.dbscan_cluster(features_without_spend, 0.5, 100, True)

    # Churn Risk Test
    # churn = Churn_Risk(df)
    # churn.print_df()

    # print("\nDays Since Last Purchase (first 10 values):")
    # print(df['Days Since Last Purchase'].head(10))
