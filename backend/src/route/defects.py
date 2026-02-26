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
    assign_defect,
)
from src.core.dependencies import require_roles, get_current_user

router = APIRouter(prefix="/defects", tags=["Defects"])

@router.post("/")
async def create_defect_route(
    defect: DefectCreate,
    current_user=Depends(require_roles(["TESTER","USER","ADMIN"])),
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



@router.put("/{defect_id}/start")
def update_status_route(
    defect_id: str,
    current_user=Depends(require_roles(["DEVELOPER", "ADMIN"])),
):
    return update_defect_status(defect_id,'IN_PROGRESS')

@router.put("/{defect_id}/reopen")
def update_status_route(
    defect_id: str,
    current_user=Depends(require_roles(["Manager", "ADMIN","DEVELOPER"])),
):
    return update_defect_status(defect_id,'REOPENED')

@router.put("/{defect_id}/fixed")
def update_status_route(
    defect_id: str,
    current_user=Depends(require_roles(["DEVELOPER","ADMIN"])),
):
    return update_defect_status(defect_id,'FIXED')

@router.put("/{defect_id}/verify")
def update_status_route(
    defect_id: str,
    current_user=Depends(require_roles(["MANAGER","ADMIN"])),
):
    return update_defect_status(defect_id,'VERIFICATION')


@router.put("/{defect_id}/closed")
def update_status_route(
    defect_id: str,
    current_user=Depends(require_roles(["MANAGER","ADMIN"])),
):
    return update_defect_status(defect_id,'CLOSED')



# @router.put("/{defect_id}/assign")
# def assign_route(
#     defect_id: str,
#     payload: DefectAssign,
#     current_user=Depends(require_roles(["MANAGER", "ADMIN"])),
# ):
#     return assign_defect(defect_id, payload.assigned_team)