from fastapi import HTTPException, status
from src.db.supabase_client import SupabaseClient
from src.services.ai_client import classify_defect_ai
from datetime import datetime

supabase=SupabaseClient().client

VALID_TRANSITIONS = {
    "OPEN": ["ASSIGNED"],
    "ASSIGNED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["FIXED"],
    "FIXED": ["VERIFICATION"],
    "VERIFICATION": ["CLOSED", "REOPENED"],
    "REOPENED": ["ASSIGNED"],
    "CLOSED": [],
}



def create_defect(data: dict, reporter_id: str):
    base_payload = {
        **data,
        "reporter_id": reporter_id,
        "status": "OPEN",
        "severity": "MEDIUM",
    }

    insert_res = supabase.table("defects").insert(base_payload).execute()
    defect = insert_res.data[0]
    defect_id = defect["id"]

    ai_result = classify_defect_ai(
        title=data.get("title"),
        description=data.get("description"),
        module=data.get("module"),
        defect_id=defect_id, 
    )

    update_payload = {
        "severity": ai_result["severity"],
        "assigned_team": ai_result["team"],
        "duplicate_of": ai_result["duplicate_of"],
    }

    supabase.table("defects").update(update_payload).eq("id", defect_id).execute()

    return {
        **defect,
        **update_payload,
        "is_duplicate": ai_result["is_duplicate"],
        "similarity_score": ai_result["similarity_score"],
    }



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

    update_payload = {"status": new_status}

    if new_status == "CLOSED":
        update_payload["resolved_at"] = datetime.now().isoformat()
        
    if new_status == "REOPENED":
        update_payload["reopen_count"] = (defect.get("reopen_count") or 0) + 1

    updated = (
        supabase.table("defects")
        .update(update_payload)
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