# Customer Analytics & Churn Prediction Machine Learning Dashboard
## Project Website: [Website](https://customer-analytics-and-churn-predic.vercel.app/about)
<img width="1264" height="951" alt="image" src="https://github.com/user-attachments/assets/cfbf3e46-9ac4-46a3-9b62-3615f493c2b9" />

## Overview

This project is a completed internal tool for companies to gain actionable insights about their customers. The tool enables businesses to:

- Predict how much a customer might spend
- Segment customers into meaningful groups for targeted marketing
- Identify customers who are at risk of leaving (churn risk)

*Note: The data used in this project was synthetically generated and is based on the Kaggle dataset: [E-Commerce Customer Behavior Dataset](https://www.kaggle.com/datasets/uom190346a/e-commerce-customer-behavior-dataset).*

By using this tool, companies can make data-driven decisions to improve customer retention, personalize marketing, and maximize revenue.

---

## Main Capabilities

### Model Prediction (Customer Spend Prediction)
This feature predicts how much a customer is likely to spend in the future based on their profile and behavior (such as age, city, membership type, purchase history, etc.). It helps businesses forecast revenue, identify high-value customers, and tailor offers to those most likely to spend more. You enter customer details into a form, and the tool uses machine learning models (Linear Regression, Random Forest, XGBoost) to estimate their expected spend.

### Customer Segmentation
This feature groups customers into segments (clusters) based on similarities in their data (like age, spending, satisfaction, etc.). Segmentation allows companies to understand different types of customers and create targeted marketing campaigns for each group (e.g., special offers for new customers, loyalty rewards for frequent buyers). You select which features to use, and the tool applies clustering algorithms (K-Means, DBSCAN) to organize customers into distinct groups. The results show the characteristics of each segment.

### Churn Risk Classification
This feature predicts whether a customer is at risk of leaving (churning) and provides a probability score for that risk. By identifying customers likely to leave, businesses can take proactive steps (like special offers or outreach) to retain them. You enter customer information, and the tool uses a machine learning model (Random Forest) to estimate the likelihood that the customer will churn, along with a clear probability score.

---

## Tech Stack & Libraries

- **Frontend:** React, Material-UI (MUI)
- **Backend:** FastAPI (Python)
- **Machine Learning:**  
  - scikit-learn (Random Forest, Linear Regression, K-Means, DBSCAN)
  - XGBoost (XGBoost Regression)
  - pandas, numpy (data processing)
- **Other:**  
  - Axios (HTTP requests)
  - joblib (model persistence)
  - CORS middleware (API access)

---

## Folder Structure

```
Customer-Analytics-and-Churn-Prediction-Machine-Learning-Dashboard/
│
├── backend/                # FastAPI backend and ML logic
│   ├── api.py              # FastAPI API endpoints
│   ├── main.py             # Data processing and ML pipeline
│   ├── churn.py            # Churn prediction logic
│   ├── segmentation.py     # Customer segmentation logic
│   ├── e-com_customer_behavior.csv  # Synthetic dataset
│   └── models/             # ML model classes (Random Forest, XGBoost, etc.)
│
├── frontend/               # React frontend
│   ├── public/             # Static assets (index.html, icons, etc.)
│   └── src/                # Source code
│       ├── components/     # Reusable UI components (forms, navbar, results)
│       ├── pages/          # Main app pages (ML, Segmentation, Churn, About)
│       ├── App.js          # Main React app
│       └── ...             # Other frontend files (theme, styles, etc.)
│
├── requirements.txt        # Python backend dependencies
└── README.md               # Project documentation
```

---

## Machine Learning Algorithms Used

- **Linear Regression:** Predicts customer spend based on input features.
- **Random Forest:** Used for both spend prediction and churn risk classification; combines many decision trees for robust results.
- **XGBoost Regression:** Advanced regression model for spend prediction.
- **K-Means Clustering:** Groups customers into segments based on feature similarity.
- **DBSCAN Clustering:** Finds clusters of customers with similar behaviors, even if the clusters are irregularly shaped.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Customer-Insights-ML-Tool.git
cd Customer-Insights-ML-Tool
```

### 2. Backend Setup (Python)
- Create and activate a virtual environment:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  ```
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Start the FastAPI server from the project root:
  ```bash
  uvicorn backend.api:app --reload
  ```
  The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 3. Frontend Setup (React)
- Open a new terminal and navigate to the `frontend` directory:
  ```bash
  cd frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the React development server:
  ```bash
  npm start
  ```
  The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Example Use Cases

- Revenue Forecasting: Predict how much a new or existing customer will spend.
- Targeted Marketing: Segment customers and design campaigns for each group.
- Customer Retention: Identify and reach out to customers at high risk of churning.
