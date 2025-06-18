from fastapi import FastAPI
from typing import Union  # asgi server used to run python web applications with fastapi
from pydantic import BaseModel  # python lib used for data validation

app = FastAPI()

# data model that FastAPI uses to validate and parse incomding request data


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None


# In-memory "database"
items_db = {
    1: {"name": "Apple", "price": 1.99, "is_offer": False},
    2: {"name": "Banana", "price": 0.99, "is_offer": True}
}

'''
@app.get: reading/fetching data
@app.put: updating/replacing data
'''


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int):
    return items_db.get(item_id, {"error": "Item not found"})


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    items_db[item_id] = item.dict()
    return {"msg": "Item updated", "item": items_db[item_id]}
