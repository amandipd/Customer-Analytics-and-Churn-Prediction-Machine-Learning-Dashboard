from fastapi import FastAPI
from src.main import Main
from pydantic import BaseModel
import pandas as pd
from src.models.linear_regression import Linear_Regression
from src.models.random_forest import Random_Forest
from src.models.xgboost import XGBoost_Regression
import requests

# To start FastAPI Server
'''
uvicorn src.api:app --reload
'''

app = FastAPI()
main_instance = Main()
df = main_instance.get_df()

# input schema


class ModelInput(BaseModel):
    Gender: str
    Age: float
    City: str
    Membership_Type: str
    Items_Purchased: int
    Average_Rating: float
    Discount_Applied: bool
    Days_Since_Last_Purchase: int
    Satisfaction_Level: str


@app.post("/predict/linear-regression")
def predict_linear_regression(input: ModelInput):
    # Convert input to DataFrame
    input_df = pd.DataFrame([input.model_dump()])
    model = Linear_Regression(df)
    model.linear_regression()
    prediction = model.model.predict(input_df)[0]
    return {"prediction": prediction}


@app.post("/predict/random-forest")
def predict_random_forest(input: ModelInput):
    input_df = pd.DataFrame([input.model_dump()])
    model = Random_Forest(df)
    model.random_forest_regressor()
    prediction = model.rf_model.predict(input_df)[0]
    return {"prediction": prediction}


@app.post("/predict/xgboost")
def predict_xgboost(input: ModelInput):
    input_df = pd.DataFrame([input.model_dump()])
    model = XGBoost_Regression(df)
    model.xgboost_regression()
    prediction = model.model.predict(input_df)[0]
    return {"prediction": prediction}


'''
# testing api-endpoints
url = "http://127.0.0.1:8000/predict/linear-regression"
data = {
    "Gender": "Male",
    "Age": 27,
    "City": "San Francisco",
    "Membership_Type": "Gold",
    "Items_Purchased": 14,
    "Average_Rating": 4.4,
    "Discount_Applied": True,
    "Days_Since_Last_Purchase": 14,
    "Satisfaction_Level": "Satisfied"
}
response = requests.post(url, json=data)
print(response.json())
'''
