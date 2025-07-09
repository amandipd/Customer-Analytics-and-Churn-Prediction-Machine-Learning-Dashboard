from fastapi import FastAPI
from backend.main import Main, preprocess_user_input
from pydantic import BaseModel
from fastapi import Query
import pandas as pd
from backend.models.linear_regression import Linear_Regression
from backend.models.random_forest import Random_Forest
from backend.models.xgboost import XGBoost_Regression
import requests
from fastapi import Body
from backend.segmentation import Segmentation
from backend.churn import Churn
from fastapi.middleware.cors import CORSMiddleware

'''
To start FastAPI Server
uvicorn src.api:app --reload

Open Swagger UI
http://127.0.0.1:8000/docs
'''

app = FastAPI()
main_instance = Main()
df = main_instance.get_df()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow requests from any website
    allow_credentials=True,  # allows cookies and authentication headers to be sent
    allow_methods=["*"],  # allows all http methods (GET, POST, PUT, etc)
    allow_headers=["*"],  # allows all headers
)

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
    user_input = input.model_dump()
    model = Linear_Regression(df)
    model.linear_regression()
    feature_columns = list(model.feature_columns)
    input_df = preprocess_user_input(user_input, feature_columns)
    prediction = model.model.predict(input_df)[0]
    return {"prediction": prediction}


@app.post("/predict/random-forest")
def predict_random_forest(input: ModelInput):
    user_input = input.model_dump()
    model = Random_Forest(df)
    model.random_forest_regressor()
    feature_columns = list(model.feature_columns)
    input_df = preprocess_user_input(user_input, feature_columns)
    prediction = model.rf_model.predict(input_df)[0]
    return {"prediction": prediction}


@app.post("/predict/xgboost")
def predict_xgboost(input: ModelInput):
    user_input = input.model_dump()
    model = XGBoost_Regression(df)
    model.xgboost_regression()
    feature_columns = list(model.feature_columns)
    input_df = preprocess_user_input(user_input, feature_columns)
    prediction = model.model.predict(input_df)[0]
    return {"prediction": prediction}


@app.get("/model-stats/{model_name}")
def get_model_stats(model_name: str):
    if model_name == "linear-regression":
        model = Linear_Regression(df)
        model.linear_regression()
        stats = model.get_stats()
    elif model_name == "random-forest":
        model = Random_Forest(df)
        model.random_forest_regressor()
        stats = model.get_stats()
    elif model_name == "xgboost":
        model = XGBoost_Regression(df)
        model.xgboost_regression()
        stats = model.get_stats()
    else:
        return {"error": "Invalid model name"}
    return stats


class KMeansInput(BaseModel):
    features: list[str]
    n_clusters: int = 3


@app.post("/segmentation/kmeans")
def kmeans_segmentation(input: KMeansInput):
    seg = Segmentation(df)
    df_clusters = seg.k_means_cluster(
        input.features, n_clusters=input.n_clusters, plot=False)

    # Prepare cluster statistics
    clusters = df_clusters['Cluster'].unique()
    stats = {}
    for cluster in clusters:
        cluster_df = df_clusters[df_clusters['Cluster'] == cluster]
        size = len(cluster_df)

        numeric_features = [
            ("avg_total_spend", "Total Spend"),
            ("avg_age", "Age"),
            ("avg_items_purchased", "Items_Purchased"),
            ("avg_rating", "Average_Rating"),
            ("avg_days_since_last_purchase", "Days_Since_Last_Purchase")
        ]
        numeric_averages = {}
        for stat_name, col_name in numeric_features:
            numeric_averages[stat_name] = cluster_df[col_name].mean()
        pct_discount = cluster_df['Discount_Applied'].mean() * 100

        # Categorical distributions
        gender_dist = cluster_df['Gender'].value_counts(
            normalize=True).to_dict()
        membership_dist = cluster_df['Membership_Type'].value_counts(
            normalize=True).to_dict()
        satisfaction_dist = cluster_df['Satisfaction_Level'].value_counts(
            normalize=True).to_dict()
        stats[int(cluster)] = {
            'size': size,
            **numeric_averages,
            'pct_discount_applied': pct_discount,
            'gender_distribution': gender_dist,
            'membership_type_distribution': membership_dist,
            'satisfaction_level_distribution': satisfaction_dist
        }
    assignments = df_clusters[input.features +
                              ['Cluster']].to_dict(orient='records')
    return {"assignments": assignments, "stats": stats}


class ChurnInput(BaseModel):
    Age: float
    Total_Spend: float
    Items_Purchased: int
    Average_Rating: float
    Discount_Applied: int
    Days_Since_Last_Purchase: float
    Gender_Female: int = 0
    Gender_Male: int = 0
    # Add all possible one-hot columns for City, Membership Type, Satisfaction Level as needed
    # For simplicity, only the above are required for now


@app.post("/predict/churn")
def predict_churn(input: ChurnInput):
    churn_model = Churn(df)
    # Convert input to DataFrame with one row
    input_dict = input.model_dump()
    input_dict["Total Spend"] = input_dict.pop("Total_Spend")
    input_dict["Items Purchased"] = input_dict.pop("Items_Purchased")
    input_dict["Average Rating"] = input_dict.pop("Average_Rating")
    input_dict["Discount Applied"] = input_dict.pop("Discount_Applied")
    input_dict["Days Since Last Purchase"] = input_dict.pop(
        "Days_Since_Last_Purchase")

    for col in churn_model.df.columns:
        if col not in input_dict and col not in ["Customer ID", "churn_risk"]:
            input_dict[col] = 0

    input_df = pd.DataFrame([input_dict])[churn_model.df.drop(
        columns=["Customer ID", "churn_risk"]).columns]

    risk = int(churn_model.model.predict(input_df)[0])
    proba = float(churn_model.model.predict_proba(input_df)[0][1])
    return {
        "churn_risk": risk,
        "probability": proba,
        "model_accuracy": churn_model.accuracy
    }


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
