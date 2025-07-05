from fastapi import FastAPI
from src.main import Main 

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "API is up and running!"}
