# CLV Prediction Dashboard

A modern, full-stack dashboard for Customer Lifetime Value (CLV) prediction, customer segmentation, and churn risk classification. Built with a FastAPI backend and a React (Material-UI) frontend.

---

## Features

- **ML Model Prediction:**
  - Predict customer spend using Linear Regression, Random Forest, or XGBoost.
  - View model statistics (R², MAE, RMSE, etc.).
- **Segmentation Graphs:**
  - Visualize customer segments using K-Means or DBSCAN clustering.
  - Interactive 2D/3D cluster plots and segment statistics.
- **Churn Risk Classification:**
  - Predict churn risk for individual customers using a Random Forest classifier.
  - View probability and model accuracy.


---

## API Endpoints

- `POST /predict/linear-regression` — Predict with Linear Regression
- `POST /predict/random-forest` — Predict with Random Forest
- `POST /predict/xgboost` — Predict with XGBoost
- `GET /model-stats/{model_name}` — Get model statistics
- `POST /segmentation/kmeans` — K-Means segmentation and stats
- `POST /segmentation/dbscan` — DBSCAN segmentation and stats
- `POST /predict/churn` — Churn risk prediction and probability

---

## License

MIT License
