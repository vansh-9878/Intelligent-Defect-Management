import faiss
import numpy as np


DIMENSION = 384

index = faiss.IndexFlatIP(DIMENSION)

id_map: list[str] = []


def normalize(vec: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec
    return vec / norm


def add_vector(embedding: list[float], defect_id: str):
    vec = np.array(embedding).astype("float32")
    vec = normalize(vec)

    index.add(vec.reshape(1, -1))
    id_map.append(defect_id)


def search_similar(embedding: list[float], k: int = 3):
    if index.ntotal == 0:
        return None, 0.0

    vec = np.array(embedding).astype("float32")
    vec = normalize(vec)

    scores, indices = index.search(vec.reshape(1, -1), k)

    best_score = float(scores[0][0])
    best_idx = int(indices[0][0])

    if best_idx == -1:
        return None, 0.0

    return id_map[best_idx], best_score