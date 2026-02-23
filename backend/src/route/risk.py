from fastapi import APIRouter, Depends, HTTPException
from src.core.dependencies import require_roles
from src.services.risk_service import (
    compute_project_risk,
    get_defect_risk,
)

router = APIRouter(prefix="/risk", tags=["Risk"])



@router.get("/project")
def project_risk(
    current_user=Depends(require_roles(["MANAGER", "ADMIN"]))
):
    return compute_project_risk()



@router.get("/defect/{defect_id}")
def defect_risk(
    defect_id: str,
    current_user=Depends(require_roles(["MANAGER", "ADMIN"]))
):
    result = get_defect_risk(defect_id)

    if not result:
        raise HTTPException(status_code=404, detail="Defect not found")

    return result