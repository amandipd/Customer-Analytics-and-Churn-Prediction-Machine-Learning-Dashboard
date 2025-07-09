from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np


class Linear_Regression:

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

        X_train, X_test, y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42)
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)
        self.y_pred = self.model.predict(X_test)
        self.feature_columns = X.columns
        return self.model

    def evaluate_model(self):
        # Evaluating Model and Coefficents
        print("----------------------------LIN REG RESULTS----------------------------")
        print("R^2 score:", r2_score(self.y_test, self.y_pred))
        print("Mean Squared Error:", mean_squared_error(self.y_test, self.y_pred))
        rmse = np.sqrt(mean_squared_error(self.y_test, self.y_pred))
        print(f"RMSE: {rmse}")
        print("Intercept:", self.model.intercept_)
        print("Coefficients:", list(zip(self.feature_columns, self.model.coef_)))

    def get_stats(self):
        y_true = self.y_test  # assuming you have train/test split
        y_pred = self.model.predict(self.X_test)
        return {
            "r2": r2_score(y_true, y_pred),
            "mae": mean_absolute_error(y_true, y_pred),
            "rmse": mean_squared_error(y_true, y_pred, squared=False)
        }
