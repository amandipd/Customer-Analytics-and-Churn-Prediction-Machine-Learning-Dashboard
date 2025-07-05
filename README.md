# Customer Segmentation & Churn ML Tool

A machine learning project to predict customer lifetime value and analyze customer behavior patterns. Currently under development.

## 🎯 Goals
- Predict Customer Lifetime Value using demographics and purchase data
- Segment customers into meaningful groups
- Identify at-risk customers (churn prediction)
- Compare multiple regression models

## 📊 Data
Customer data including demographics, purchase history, membership type, and satisfaction metrics.

## 🛠️ Technical Stack
- Python
- pandas, numpy, scikit-learn
- Machine Learning (Regression, Clustering, Classification)
- Data Analysis & Visualization

## 🚀 Features
- Data cleaning and preprocessing (missing value imputation, boolean conversion, one-hot encoding, standardization)
- Linear Regression model with performance metrics (R², MSE, RMSE)
- Random Forest Regressor with performance metrics (R², MSE, RMSE)
- User input prediction function
- Modular code for easy extension

## 🌐 Dummy FastAPI Example API
This project includes a simple FastAPI app, created as a learning exercise to understand API development. The goal is to later integrate this API with the machine learning model for serving predictions and interacting with the data pipeline.

**Endpoints:**
- `GET /` — Returns a welcome message.
- `GET /items/{item_id}` — Returns the item data for the given ID from an in-memory database.
- `PUT /items/{item_id}` — Updates or replaces the item with the given ID using JSON data in the request body.

**Example usage:**
```bash
# Update item 1
curl -X PUT "http://127.0.0.1:8000/items/1" -H "Content-Type: application/json" -d "{\"name\": \"Orange\", \"price\": 2.49, \"is_offer\": false}"

# Get item 1
curl http://127.0.0.1:8000/items/1
```

You can also interact with the API using the auto-generated docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## 🧩 Planned Extensions
- XGBoost regression model
- Customer segmentation (clustering)
- Churn risk classification
- Model comparison module
- Model explainability (SHAP/LIME)
- Interactive dashboard (Streamlit or Dash)
- Automated reporting (PDF/HTML)
- REST API for predictions
