from fastapi import APIRouter, Depends
from src.models.defect import (
    DefectCreate,
    DefectStatusUpdate,
    DefectAssign,
)
from src.services.defect_services import (
    create_defect,
    list_defects,
    get_defect,
    update_defect_status,
    assign_defect,d
)
from src.core.dependencies import require_roles, get_current_user

router = APIRouter(prefix="/defects", tags=["Defects"])

@router.post("/")
def create_defect_route(
    defect: DefectCreate,
    current_user=Depends(require_roles(["TESTER","USER"])),
):
    created = create_defect(defect.dict(), current_user["id"])
    return created



@router.get("/")
def list_defects_route(
    current_user=Depends(get_current_user),
):
    return list_defects()



@router.get("/{defect_id}")
def get_defect_route(
    defect_id: str,
    current_user=Depends(get_current_user),
):
    return get_defect(defect_id)



@router.put("/{defect_id}/status")
def update_status_route(
    defect_id: str,
    payload: DefectStatusUpdate,
    current_user=Depends(require_roles(["DEVELOPER", "MANAGER"])),
):
    return update_defect_status(defect_id, payload.status)



@router.put("/{defect_id}/assign")
def assign_route(
    defect_id: str,
    payload: DefectAssign,
    current_user=Depends(require_roles(["MANAGER", "ADMIN"])),
):
    return assign_defect(defect_id, payload.assigned_team)