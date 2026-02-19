from fastapi import FastAPI
from src.logger import logging

app = FastAPI(title="Intelligent Defect Management Platform")


@app.get("/")
def root():
    logging.info("Connected to backend")
    return {"message": "IDMP Backend Running 🚀"}
