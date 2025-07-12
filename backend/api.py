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
To start FastAPI Server from root of repository
uvicorn backend.api:app --reload

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
    feature_columns = model.feature_columns
    input_df = preprocess_user_input(user_input, feature_columns)
    prediction = model.predict(input_df)[0]
    return {"prediction": prediction}


@app.post("/predict/xgboost")
def predict_xgboost(input: ModelInput):
    user_input = input.model_dump()
    model = XGBoost_Regression(df)
    model.xgboost_regression()
    feature_columns = list(model.feature_columns)
    input_df = preprocess_user_input(user_input, feature_columns)
    prediction = model.model.predict(input_df)[0]
    return {"prediction": float(prediction)}


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


@app.get("/segmentation/features")
def get_segmentation_features():
    """Get available features for segmentation"""
    # Get features excluding Customer ID and Total Spend
    features = main_instance.get_features_without_spend()

    # Create feature options with labels
    feature_options = []
    for feature in features:
        if feature in ['Age', 'Items Purchased', 'Average Rating', 'Discount Applied', 'Days Since Last Purchase']:
            feature_options.append({
                'value': feature,
                'label': feature,
                'type': 'numeric'
            })
        elif feature.startswith('Gender_'):
            gender = feature.replace('Gender_', '')
            feature_options.append({
                'value': feature,
                'label': f'Gender ({gender})',
                'type': 'categorical'
            })
        elif feature.startswith('City_'):
            city = feature.replace('City_', '')
            feature_options.append({
                'value': feature,
                'label': f'City: {city}',
                'type': 'categorical'
            })
        elif feature.startswith('Membership Type_'):
            membership = feature.replace('Membership Type_', '')
            feature_options.append({
                'value': feature,
                'label': f'Membership: {membership}',
                'type': 'categorical'
            })
        elif feature.startswith('Satisfaction Level_'):
            satisfaction = feature.replace('Satisfaction Level_', '')
            feature_options.append({
                'value': feature,
                'label': f'Satisfaction: {satisfaction}',
                'type': 'categorical'
            })

    return {"features": feature_options}


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
            ("avg_items_purchased", "Items Purchased"),
            ("avg_rating", "Average Rating"),
            ("avg_days_since_last_purchase", "Days Since Last Purchase")
        ]
        numeric_averages = {}
        for stat_name, col_name in numeric_features:
            if col_name in cluster_df.columns:
                value = cluster_df[col_name].mean()
                # unstandardize columns before returning to frontend
                if col_name in ["Age", "Items Purchased", "Average Rating", "Days Since Last Purchase"]:
                    std = main_instance.standardization_params[col_name]["std"]
                    mean = main_instance.standardization_params[col_name]["mean"]
                    value = (value * std) + mean
                numeric_averages[stat_name] = value
            else:
                numeric_averages[stat_name] = 0
        pct_discount = cluster_df['Discount Applied'].mean() * 100

        gender_dist = cluster_df['Gender'].value_counts(
            normalize=True).to_dict() if 'Gender' in cluster_df.columns else {}
        membership_dist = cluster_df['Membership Type'].value_counts(
            normalize=True).to_dict() if 'Membership Type' in cluster_df.columns else {}
        satisfaction_dist = cluster_df['Satisfaction Level'].value_counts(
            normalize=True).to_dict() if 'Satisfaction Level' in cluster_df.columns else {}
        stats[int(cluster)] = {
            'size': size,
            **numeric_averages,
            'pct_discount_applied': pct_discount,
            'gender_distribution': gender_dist,
            'membership_type_distribution': membership_dist,
            'satisfaction_level_distribution': satisfaction_dist
        }
    # Remove assignments output, only return stats
    return {"stats": stats}


class DBSCANInput(BaseModel):
    features: list[str]
    eps: float = 0.5
    min_samples: int = 5


@app.post("/segmentation/dbscan")
def dbscan_segmentation(input: DBSCANInput):
    seg = Segmentation(df)
    df_clusters = seg.dbscan_cluster(
        input.features, eps=input.eps, min_samples=input.min_samples, plot=False)

    clusters = df_clusters['Cluster'].unique()
    stats = {}
    for cluster in clusters:
        cluster_df = df_clusters[df_clusters['Cluster'] == cluster]
        size = len(cluster_df)

        numeric_features = [
            ("avg_total_spend", "Total Spend"),
            ("avg_age", "Age"),
            ("avg_items_purchased", "Items Purchased"),
            ("avg_rating", "Average Rating"),
            ("avg_days_since_last_purchase", "Days Since Last Purchase")
        ]
        numeric_averages = {}
        for stat_name, col_name in numeric_features:
            # unstandardize data before sending to frontend
            if col_name in cluster_df.columns:
                value = cluster_df[col_name].mean()
                if col_name in ["Age", "Items Purchased", "Average Rating", "Days Since Last Purchase"]:
                    std = main_instance.standardization_params[col_name]["std"]
                    mean = main_instance.standardization_params[col_name]["mean"]
                    value = (value * std) + mean
                numeric_averages[stat_name] = value
            else:
                numeric_averages[stat_name] = 0
        pct_discount = cluster_df['Discount Applied'].mean() * 100

        gender_dist = cluster_df['Gender'].value_counts(
            normalize=True).to_dict() if 'Gender' in cluster_df.columns else {}
        membership_dist = cluster_df['Membership Type'].value_counts(
            normalize=True).to_dict() if 'Membership Type' in cluster_df.columns else {}
        satisfaction_dist = cluster_df['Satisfaction Level'].value_counts(
            normalize=True).to_dict() if 'Satisfaction Level' in cluster_df.columns else {}
        stats[int(cluster)] = {
            'size': size,
            **numeric_averages,
            'pct_discount_applied': pct_discount,
            'gender_distribution': gender_dist,
            'membership_type_distribution': membership_dist,
            'satisfaction_level_distribution': satisfaction_dist
        }
    # Remove assignments output, only return stats for DBSCAN
    return {"stats": stats}


class ChurnInput(BaseModel):
    Age: float
    Total_Spend: float
    Items_Purchased: int
    Average_Rating: float
    Discount_Applied: int
    Days_Since_Last_Purchase: float
    Gender: str
    City: str
    Membership_Type: str
    Satisfaction_Level: str


@app.post("/predict/churn")
def predict_churn(input: ChurnInput):
    # Create raw DataFrame for churn (without standardization)
    import os
    csv_path = os.path.join(os.path.dirname(__file__),
                            'e-com_customer_behavior.csv')
    raw_df = pd.read_csv(csv_path)

    # Impute missing values and convert booleans (same as main.py)
    most_common = raw_df["Satisfaction Level"].mode()[0]
    raw_df["Satisfaction Level"] = raw_df["Satisfaction Level"].fillna(
        most_common)
    raw_df["Discount Applied"] = raw_df["Discount Applied"].astype(int)

    # One-hot encode categorical columns (but don't standardize)
    raw_df = pd.get_dummies(
        raw_df, columns=['Gender', 'City', 'Membership Type', 'Satisfaction Level'])

    # Use raw DataFrame for churn model
    churn_model = Churn(raw_df)

    # Convert input to match the raw DataFrame format
    input_dict = input.model_dump()
    input_dict["Total Spend"] = input_dict.pop("Total_Spend")
    input_dict["Items Purchased"] = input_dict.pop("Items_Purchased")
    input_dict["Average Rating"] = input_dict.pop("Average_Rating")
    input_dict["Discount Applied"] = input_dict.pop("Discount_Applied")
    input_dict["Days Since Last Purchase"] = input_dict.pop(
        "Days_Since_Last_Purchase")

    # Preprocess input to match the model's expected format
    input_df = preprocess_user_input(input_dict, churn_model.df.drop(
        columns=["Customer ID", "churn_risk"]).columns)

    risk = int(churn_model.model.predict(input_df)[0])
    proba_array = churn_model.model.predict_proba(input_df)[0]
    # Handle case where model only predicts one class
    if len(proba_array) == 1:
        proba = float(proba_array[0])
    else:
        proba = float(proba_array[1])  # Probability of class 1 (churn risk)
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
