from fastapi import FastAPI
from pydantic import BaseModel
from ai_service.model import predict_severity, predict_team, generate_embedding

from ai_service.vector_store import add_vector, search_similar
import uuid

app = FastAPI(title="IDMP AI Service")


class AIRequest(BaseModel):
    title: str
    description: str | None = None
    module: str | None = None


@app.post("/classify")
def classify_defect(req: AIRequest):
    text = f"{req.title} {req.description or ''}"

    severity = predict_severity(text)
    team = predict_team(req.module or "")
    embedding = generate_embedding(text)

    similar_id, score = search_similar(embedding)

    is_duplicate = False
    duplicate_of = None

    THRESHOLD = 0.85

    if similar_id and score >= THRESHOLD:
        is_duplicate = True
        duplicate_of = similar_id

    new_id = str(uuid.uuid4())
    add_vector(embedding, new_id)

    return {
        "severity": severity,
        "team": team,
        "embedding": embedding,
        "is_duplicate": is_duplicate,
        "duplicate_of": duplicate_of,
        "similarity_score": score,
        "vector_id": new_id,
    }


@app.get("/")
def root():
    return {"message": "AI Service Running 🤖"}