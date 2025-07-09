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

## Getting Started

### 1. Backend (FastAPI)

**Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Run the API:**
```bash
uvicorn backend.api:app --reload
```

- API docs available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React)

**Setup:**
```bash
cd frontend
npm install
```

**Run the App:**
```bash
npm start
```

- App runs at: [http://localhost:3000](http://localhost:3000)

---

## Quick Setup

1. **Start the Backend (FastAPI/Uvicorn):**

   From the root of your project, run:
   ```bash
   uvicorn backend.api:app --reload
   ```
   This will start the FastAPI server at http://127.0.0.1:8000

2. **Start the Frontend (React App):**

   In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend