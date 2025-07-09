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

## Project Structure

```
CLV-Prediction/
  src/
    backend/
      api.py            # FastAPI app and endpoints
      main.py           # Data loading, preprocessing, utilities
      segmentation.py   # Segmentation logic
      churn.py          # Churn logic
      models/
        linear_regression.py
        random_forest.py
        xgboost.py
        churn.py
        __init__.py
      requirements.txt  # Backend dependencies
    frontend/
      src/
        components/
          Navbar.js
          MLForm.js
        pages/
          ML.js
          Segmentation.js
          Churn.js
        App.js
        theme.js
      public/
      package.json      # Frontend dependencies
```

---

## Getting Started

### 1. Backend (FastAPI)

**Setup:**
```bash
cd src/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Run the API:**
```bash
uvicorn api:app --reload
```

- API docs available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React)

**Setup:**
```bash
cd src/frontend
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
   npm install  # Only needed the first time
   npm start
   ```
   This will start the React app at http://localhost:3000

3. **Usage:**
   - Open your browser and go to http://localhost:3000 to use the app.
   - The frontend will communicate with the backend for predictions.

---

## Usage

- **Model Prediction:**
  - Go to the "Model Prediction" tab.
  - Enter customer details and select a model.
  - Click Predict to see the result and model stats.

- **Segmentation Graphs:**
  - Go to the "Segmentation Graphs" tab.
  - Select features and clustering method.
  - View interactive cluster plots and segment stats.

- **Churn Risk Classification:**
  - Go to the "Churn Risk Classification" tab.
  - Enter customer info to get churn risk and probability.

---

## API Endpoints (Backend)

- `POST /predict/linear-regression` — Predict with Linear Regression
- `POST /predict/random-forest` — Predict with Random Forest
- `POST /predict/xgboost` — Predict with XGBoost
- `GET /model-stats/{model_name}` — Get model statistics
- `POST /segmentation/kmeans` — K-Means segmentation and stats
- `POST /segmentation/dbscan` — DBSCAN segmentation and stats
- `POST /predict/churn` — Churn risk prediction and probability

---

## Customization & Theming

- Uses Material-UI dark theme and Inter font for a modern dashboard look.
- Easily extendable for new features, models, or visualizations.

---

## License

MIT License
