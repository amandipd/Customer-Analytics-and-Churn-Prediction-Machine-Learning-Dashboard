from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
import numpy as np


class Prediction_Models:

    def __init__(self, X, y):
        self.X = X
        self.y = y

    def lin_reg(self):
        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y, test_size=0.2, random_state=42)

        model = LinearRegression()
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        # R^2 and RMSE
        r2 = r2_score(y_test, predictions)
        rmse = np.sqrt(mean_squared_error(y_test, predictions))

        # Print results
        print("\nLinear Regression Results:")
        print("------------------------")
        print("R² Score:", round(r2, 4))
        print("RMSE:", round(rmse, 4))

        # Feature coefficents show how much each feature affects target
        # positive coefficent == as feature increases, total spend will increase
        # negative coefficient == as feature increases, total spend will decrease
        # size indicates sterch of effect
        print("\nFeature Coefficients:")
        print("------------------------")
        for i in range(len(self.X.columns)):
            feature = self.X.columns[i]
            coef = model.coef_[i]
            print(feature + ":", round(coef, 4))
        print("------------------------")
