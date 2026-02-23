from src.db.supabase_client import SupabaseClient
from datetime import datetime

supabase=SupabaseClient().client

def compute_mttr():
    res = (
        supabase.table("defects")
        .select("created_at,resolved_at")
        .not_.is_("resolved_at", "null")
        .execute()
    )

    defects = res.data

    if not defects:
        return 0.0

    total_seconds = 0
    count = 0

    for d in defects:
        created = datetime.fromisoformat(d["created_at"])
        resolved = datetime.fromisoformat(d["resolved_at"])

        diff = (resolved - created).total_seconds()
        total_seconds += diff
        count += 1

    mttr_hours = (total_seconds / count) / 3600
    return round(mttr_hours, 2)



def compute_recurrence_rate():
    res = supabase.table("defects").select("status").execute()
    defects = res.data

    if not defects:
        return 0.0

    reopened = sum(1 for d in defects if d["status"] == "REOPENED")
    total = len(defects)

    return round((reopened / total) * 100, 2)



def compute_status_summary():
    res = supabase.table("defects").select("status").execute()
    defects = res.data

    summary = {
        "ASSIGNED": 0,
        "IN_PROGRESS": 0,
        "FIXED": 0,
        "VERIFICATION": 0,
        "CLOSED": 0,
        "REOPENED": 0,
    }

    for d in defects:
        status = d["status"]
        if status in summary:
            summary[status] += 1

    return summary



def get_project_metrics():
    return {
        "mttr_hours": compute_mttr(),
        "recurrence_rate_percent": compute_recurrence_rate(),
        "status_summary": compute_status_summary(),
    }