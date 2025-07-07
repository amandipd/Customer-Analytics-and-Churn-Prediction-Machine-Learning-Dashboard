from fastapi import FastAPI
from src.main import Main

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "API is up and running!"}

# Endpoint for Model A output


@app.get("/model-a-output")
def get_model_a_output():
    # Placeholder: Replace with actual model logic
    return {"model": "A", "output": "This is Model A's output."}

# Endpoint for Model B output


@app.get("/model-b-output")
def get_model_b_output():
    # Placeholder: Replace with actual model logic
    return {"model": "B", "output": "This is Model B's output."}

# Endpoint for Segmentation results


@app.get("/segmentation")
def get_segmentation():
    # Placeholder: Replace with actual segmentation logic
    return {"segmentation": "This is the segmentation result."}
