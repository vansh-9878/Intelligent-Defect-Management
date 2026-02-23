import faiss
import numpy as np
import os
import json


DIMENSION = 384
DATA_DIR = "ai_service/data"
INDEX_PATH = os.path.join(DATA_DIR, "faiss_index.bin")
MAP_PATH = os.path.join(DATA_DIR, "id_map.json")

os.makedirs(DATA_DIR, exist_ok=True)


if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
else:
    index = faiss.IndexFlatIP(DIMENSION)


if os.path.exists(MAP_PATH):
    with open(MAP_PATH, "r") as f:
        id_map = json.load(f)
else:
    id_map = []



def normalize(vec: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec
    return vec / norm



def save_index():
    faiss.write_index(index, INDEX_PATH)
    with open(MAP_PATH, "w") as f:
        json.dump(id_map, f)



def add_vector(embedding: list[float], defect_id: str):
    vec = np.array(embedding).astype("float32")
    vec = normalize(vec)

    index.add(vec.reshape(1, -1))
    id_map.append(defect_id)

    save_index()



def search_similar(embedding: list[float], k: int = 3):
    if index.ntotal == 0:
        return None, 0.0

    vec = np.array(embedding).astype("float32")
    vec = normalize(vec)

    scores, indices = index.search(vec.reshape(1, -1), k)

    best_score = float(scores[0][0])
    best_idx = int(indices[0][0])

    if best_idx == -1 or best_idx >= len(id_map):
        return None, 0.0

    return id_map[best_idx], best_score