import numpy as np
import pandas as pd
from models import Models
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


class Churn_Risk:

    def __init__(self, df):
        self.df = df
        # Adding a binary churn_risk column, and assigning 1 if days_since_last_purcahse is > 45
        df['churn_risk'] = df['Days Since Last Purchase'].apply(
            lambda x: 1 if x > 44 else 0)

    def train_random_forest(df, target_column, test_size=0.2, random_state=42):
        '''
        How a Random Forest Classifier works:
        - builds desicion trees during training time
        - each tree makes its own individual predictions (0 or 1)
        - final prediction is made from aggregating the predictions of all trees
        - randomness of data selection for training reduces overfitting and increases generalization, making it more robust than a single tree

        '''
        X = df.drop(columns=[target_column])
        y = df[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

        # n-estimators corresponds to # of desicion trees
        model = RandomForestClassifier(
            n_estimators=100, random_state=random_state)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)

        return model, accuracy, report

    def predict_churn_risk(model, input_features):
        '''
        Predicts churn risk (0 or 1) for a given 
        set of input features using a trained model
        '''

        # convert dictionary to dataframe if needed
        if isinstance(input_features, dict):
            input_df = pd.DataFrame([input_features])
        else:
            input_df = input_features
        prediction = model.predict(input_df)[0]
        return prediction
    
    # Debugging
    def print_df(self):
        print(self.df.head(20))
