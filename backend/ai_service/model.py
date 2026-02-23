from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def predict_severity(text: str) -> str:
    text_lower = text.lower()

    if any(word in text_lower for word in ["crash", "data loss", "payment failed"]):
        return "CRITICAL"
    if any(word in text_lower for word in ["error", "fails", "exception"]):
        return "HIGH"
    if any(word in text_lower for word in ["ui", "alignment", "typo"]):
        return "LOW"
    return "MEDIUM"


def predict_team(module: str) -> str:
    if not module:
        return "GENERAL"

    m = module.lower()

    if "payment" in m:
        return "PAYMENTS"
    if "auth" in m or "login" in m:
        return "AUTH"
    if "ui" in m or "frontend" in m:
        return "FRONTEND"
    if "api" in m or "backend" in m:
        return "BACKEND"

    return "GENERAL"


def generate_embedding(text: str):
    emb = model.encode(text)
    return emb.tolist()