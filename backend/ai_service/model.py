from sentence_transformers import SentenceTransformer
import numpy as np
from ai_service.constants import SEVERITY_LABELS,TEAM_LABELS

model = SentenceTransformer("all-MiniLM-L6-v2")


severity_embeddings = {
    label: model.encode(desc, normalize_embeddings=True)
    for label, desc in SEVERITY_LABELS.items()
}


team_embeddings = {
    label: model.encode(desc, normalize_embeddings=True)
    for label, desc in TEAM_LABELS.items()
}


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))


def predict_severity(text: str):
    text_emb = model.encode(text, normalize_embeddings=True)

    best_label = "MEDIUM"
    best_score = -1.0

    for label, emb in severity_embeddings.items():
        score = cosine_similarity(text_emb, emb)
        if score > best_score:
            best_score = score
            best_label = label

    return best_label


def predict_team(text: str):
    text_emb = model.encode(text, normalize_embeddings=True)

    best_label = "GENERAL"
    best_score = -1.0

    for label, emb in team_embeddings.items():
        score = cosine_similarity(text_emb, emb)
        if score > best_score:
            best_score = score
            best_label = label

    return best_label

def generate_embedding(text: str):
    emb = model.encode(text, normalize_embeddings=True)
    return emb.tolist()