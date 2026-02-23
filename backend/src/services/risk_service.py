from datetime import datetime
from src.db.supabase_client import SupabaseClient

supabase = SupabaseClient().client


SEVERITY_WEIGHTS = {
    "CRITICAL": 1.0,
    "HIGH": 0.8,
    "MEDIUM": 0.5,
    "LOW": 0.2,
}


def compute_age_factor(created_at: str) -> float:
    created = datetime.fromisoformat(created_at)
    now = datetime.utcnow()

    hours_open = (now - created).total_seconds() / 3600

    return min(hours_open / 72, 1.0)



def compute_recurrence_factor(reopen_count: int) -> float:
    return min(reopen_count / 3, 1.0)



def compute_defect_risk(defect: dict) -> float:
    severity_weight = SEVERITY_WEIGHTS.get(defect.get("severity"), 0.5)

    recurrence_factor = compute_recurrence_factor(
        defect.get("reopen_count") or 0
    )

    age_factor = compute_age_factor(defect["created_at"])

    risk = (
        severity_weight * 0.6
        + recurrence_factor * 0.25
        + age_factor * 0.15
    )

    return round(risk, 3)



def compute_project_risk():
    res = supabase.table("defects").select("*").neq("status", "CLOSED").execute()
    defects = res.data

    if not defects:
        return {
            "project_risk": 0.0,
            "total_open_defects": 0,
        }

    risks = [compute_defect_risk(d) for d in defects]
    project_risk = sum(risks) / len(risks)

    return {
        "project_risk": round(project_risk, 3),
        "total_open_defects": len(defects),
    }



def get_defect_risk(defect_id: str):
    res = supabase.table("defects").select("*").eq("id", defect_id).execute()

    if not res.data:
        return None

    defect = res.data[0]
    risk = compute_defect_risk(defect)

    return {
        "defect_id": defect_id,
        "risk_score": risk,
    }