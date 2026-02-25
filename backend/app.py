from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.logger import logging
from src.route.auth import router as auth_router
from src.route.protected import router as protected_router
from src.route.defects import router as defect_router
from src.route.metrics import router as metrics_router
from src.route.risk import router as risk_router

app = FastAPI(title="Intelligent Defect Management Platform")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(defect_router)
app.include_router(metrics_router)
app.include_router(risk_router)

@app.get("/")
def root():
    logging.info("Connected to backend")
    return {"message": "IDMP Backend Running"}