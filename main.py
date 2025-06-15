import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


def encode_and_standardize_data():
    """Read the CSV file and impute missing values in 'Satisfaction Level' with the mode."""
    df = pd.read_csv('e-com_customer_behavior.csv')

    # print(df)  # debugging
    # print(df.isnull().sum())  # check how many null vals in each column

    '''Identify mode within "Satisfaction Level" column and impute missing values with mode.'''
    most_common = df["Satisfaction Level"].mode()[0]
    df["Satisfaction Level"] = df["Satisfaction Level"].fillna(most_common)
    # Print all rows of df
    # pd.set_option('display.max_rows', None)
    # print(df)

    # Check that there are no missing values after imputing values
    # print(df.isnull().sum())

    '''Convert boolean column "Discount Applied" to numeric'''
    df["Discount Applied"] = df["Discount Applied"].astype(int)

    '''One hot encode categorical columns'''
    df = pd.get_dummies(
        df, columns=['Gender', 'City', 'Membership Type', 'Satisfaction Level'])
    # return df_encoded

    '''Standardize numerical columns to have mean of 0 and std of 1 to ensure all features equally contribute to model'''
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

    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ])

    # Full pipeline: preprocessing + linear regression
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])

    # random_state sets the seed for random number generator in split
    # if random_state is set to specific number, the data will be split the exact same every time
    # if random_state is None, it will produce a unique split every time the code is run
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    '''Evaluating Model and Coefficents'''
    print("R^2 score:", r2_score(y_test, y_pred)
          )  # measure of how well model explains variance in target variable
    print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f"RMSE: {rmse}")  # avg size of errors
    # View coefficents
    print("Intercept:", model.intercept_)
    print("Coefficients:", list(zip(X.columns, model.coef_)))

    def predict_user_input(user_input_dict)


df = encode_and_standardize_data()
linear_regression(df)
# print(df)  # debug
# print(df_encoded.columns)  # debug
