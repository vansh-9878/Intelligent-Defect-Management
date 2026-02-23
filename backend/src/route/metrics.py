from fastapi import APIRouter, Depends
from src.core.dependencies import require_roles
from src.services.metrics import get_project_metrics

router = APIRouter(prefix="/metrics", tags=["Metrics"])



@router.get("/project")
def project_metrics(
    current_user=Depends(require_roles(["MANAGER", "ADMIN"]))
):
    return get_project_metrics()