from fastapi import HTTPException, status
from src.db.supabase_client import SupabaseClient

# ---------------- VALID STATUS FLOW ---------------- #
supabase=SupabaseClient().client

VALID_TRANSITIONS = {
    "OPEN": ["TRIAGED", "ASSIGNED"],
    "TRIAGED": ["ASSIGNED"],
    "ASSIGNED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["FIXED"],
    "FIXED": ["VERIFIED"],
    "VERIFIED": ["CLOSED", "REOPENED"],
    "REOPENED": ["ASSIGNED"],
    "CLOSED": [],
}



def create_defect(data: dict, reporter_id: str):
    payload = {
        **data,
        "reporter_id": reporter_id,
        "status": "OPEN",
        # AI severity placeholder (will replace later)
        "severity": "MEDIUM",
    }

    result = supabase.table("defects").insert(payload).execute()
    return result.data[0]



def list_defects():
    res = supabase.table("defects").select("*").order("created_at", desc=True).execute()
    return res.data


def get_defect(defect_id: str):
    res = supabase.table("defects").select("*").eq("id", defect_id).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Defect not found")

    return res.data[0]


def update_defect_status(defect_id: str, new_status: str):
    defect = get_defect(defect_id)
    current_status = defect["status"]

    if new_status not in VALID_TRANSITIONS.get(current_status, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {current_status} to {new_status}",
        )

    updated = (
        supabase.table("defects")
        .update({"status": new_status})
        .eq("id", defect_id)
        .execute()
    )

    return updated.data[0]


def assign_defect(defect_id: str, team: str):
    updated = (
        supabase.table("defects")
        .update({"assigned_team": team, "status": "ASSIGNED"})
        .eq("id", defect_id)
        .execute()
    )

    return updated.data[0]