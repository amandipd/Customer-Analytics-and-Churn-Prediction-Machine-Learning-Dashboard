import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from xgboost import XGBRegressor
from segmentation import Segmentation
import joblib


def clean_data():
    """Read the CSV file, impute missing values in 'Satisfaction Level', and convert booleans to numeric."""
    df = pd.read_csv('e-com_customer_behavior.csv')

    # Impute missing values in 'Satisfaction Level'
    most_common = df["Satisfaction Level"].mode()[0]
    df["Satisfaction Level"] = df["Satisfaction Level"].fillna(most_common)

    # Convert boolean column 'Discount Applied' to numeric
    df["Discount Applied"] = df["Discount Applied"].astype(int)

    return df


def encode_and_standardize_data(df):
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


def linear_regression(df):
    X = df.drop(columns=['Customer ID', 'Total Spend'])
    y = df['Total Spend']

    ''' Identify categorical and numeric columns'''
    categorical_cols = X.select_dtypes(
        include=['object', 'category']).columns.tolist()
    numeric_cols = X.select_dtypes(
        include=['int64', 'float64']).columns.tolist()

    # random_state sets the seed for random number generator in split
    # if random_state is set to specific number, the data will be split the exact same every time
    # if random_state is None, it will produce a unique split every time the code is run
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    feature_columns = X.columns

    '''Evaluating Model and Coefficents'''
    print("----------------------------LIN REG RESULTS----------------------------")
    print("R^2 score:", r2_score(y_test, y_pred)
          )  # measure of how well model explains variance in target variable
    print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"RMSE: {rmse}")  # avg size of errors
    # View coefficents
    print("Intercept:", model.intercept_)

    print("Coefficients:", list(zip(X.columns, model.coef_)))
    return [model, feature_columns]


def random_forest_regressor(df):
    '''
    How Random Forest Regression works:
    - Multiple trees are trained on bootstrapped subsets of data (random samples with replacement)
    - Each tree is a regression desicion tree -- learns how to predict continuous numeric values
    - each tree gives its own numeric prediction
    - final output is the average of all tree outputs
    '''
    X = df.drop(columns=["Customer ID", "Total Spend"])
    y = df['Total Spend']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    # n_estimators controls the number of desicion trees in the forest
    rf_model = RandomForestRegressor(n_estimators=50, random_state=42)
    rf_model.fit(X_train, y_train)
    y_pred = rf_model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mse)
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R^2 Score: {r2:.4f}")
    print(f"RMSE: {rmse:.2f}")


def xgboost(df):
    X = df.drop(columns=["Customer ID", "Total Spend"])
    y = df['Total Spend']

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


def predict_user_input(model, user_data_dict, feature_columns):
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


df = clean_data()
# print(df.columns.tolist)
''' ['Customer ID', 'Gender', 'Age', 'City', 'Membership Type',
    'Total Spend', 'Items Purchased', 'Average Rating', 'Discount Applied',
    'Days Since Last Purchase', 'Satisfaction Level'] '''

df = encode_and_standardize_data(df)
# print(df.columns.tolist)
''' 
['Customer ID', 'Age', 'Total Spend', 'Items Purchased',
       'Average Rating', 'Discount Applied', 'Days Since Last Purchase',
       'Gender_Female', 'Gender_Male', 'City_Atlanta', 'City_Austin',
       'City_Boston', 'City_Chicago', 'City_Dallas', 'City_Denver',
       'City_Houston', 'City_Las Vegas', 'City_Los Angeles', 'City_Miami',
       'City_New York', 'City_Orlando', 'City_Philadelphia', 'City_Phoenix',
       'City_Portland', 'City_San Diego', 'City_San Francisco', 'City_Seattle',
       'Membership Type_Bronze', 'Membership Type_Gold',
       'Membership Type_Silver', 'Satisfaction Level_Neutral',
       'Satisfaction Level_Satisfied', 'Satisfaction Level_Unsatisfied']
'''
# Lin Reg
# model_and_features = linear_regression(df)
# lin_reg_model = model_and_features[0]
# feature_columns = model_and_features[1]

# Random Forest Regressor
# random_forest_regressor(df)

# XG Boost
# xgboost(df)

# Testing models
user_input = {
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

seg = Segmentation(df)


# print(lin_reg_predict_user_input(lin_reg_model, user_input, feature_columns))

# linear_regression(df)
# user_dict = {

# }
# print(df)  # debug
# print(df.columns)  # debug
