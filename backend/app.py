from fastapi import FastAPI
from src.logger import logging
from src.route.auth import router as auth_router
from src.route.protected import router as protected_router

app = FastAPI(title="Intelligent Defect Management Platform")
app.include_router(auth_router)
app.include_router(protected_router)

@app.get("/")
def root():
    logging.info("Connected to backend")
    return {"message": "IDMP Backend Running "}

