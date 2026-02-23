import requests

AI_SERVICE_URL = "http://localhost:8001/classify"


def classify_defect_ai(title, description, module, defect_id: str):
    try:
        response = requests.post(
            AI_SERVICE_URL,
            json={
                "title": title,
                "description": description,
                "module": module,
                "defect_id": defect_id,
            },
            timeout=5,
        )
        response.raise_for_status()
        return response.json()
    except Exception:
        return {
            "severity": "MEDIUM",
            "team": "GENERAL",
            "is_duplicate": False,
            "duplicate_of": None,
            "similarity_score": 0.0,
        }