import pandas as pd
from prediction_models import Prediction_Models

def read_and_clean_data():
    """Read the CSV file and impute missing values in 'Satisfaction Level' with the mode."""
    df = pd.read_csv('e-com_customer_behavior.csv')
    # print(df) # debugging

    # print(df.isnull().sum())  # check how many null vals in each column

    # Identify mode within "Satisfaction Level" column and impute missing values.
    most_common = df["Satisfaction Level"].mode()[0]

    # Impute missing values
    df["Satisfaction Level"] = df["Satisfaction Level"].fillna(most_common)

    # Print all rows of df
    # pd.set_option('display.max_rows', None)
    # print(df)

    # Check that there are no missing values after imputing values
    # print(df.isnull().sum())

    # Convert boolean column to numeric
    df["Discount Applied"] = df["Discount Applied"].astype(int)

    # One-hot encoding to convert categorical variables into a numerical format
    categorical_cols = ["Gender", "City",
                        "Membership Type", "Satisfaction Level"]
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    return df


def train_data(df):
    # Standardize selected columns in both train and test
    columns_to_standardize = [
        "Age", "Items Purchased",
        "Average Rating", "Days Since Last Purchase"
    ]

    df = standardize_columns(df, columns_to_standardize)
    X = df.drop(columns=['Customer ID', 'Total Spend'])
    y = df['Total Spend']
    model = Models(X, y)
    model.lin_reg()
    # return model


def standardize_columns(df, columns_to_standardize):
    """Standardize specified columns in the DataFrame."""
    for col in columns_to_standardize:
        mean = df[col].mean()
        std = df[col].std()
        df[col] = (df[col] - mean) / std
    return df


df = read_and_clean_data()
train_data(df)
