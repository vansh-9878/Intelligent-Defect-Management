from fastapi import APIRouter, Depends
from src.core.dependencies import get_current_user, require_roles

router = APIRouter(prefix="/test", tags=["Test Protected"])



@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": current_user,
    }


@router.get("/tester-only")
def tester_route(
    current_user=Depends(require_roles(["TESTER","USER"]))
):
    return {"message": "Hello Tester"}



@router.get("/manager-only")
def manager_route(
    current_user=Depends(require_roles(["MANAGER", "ADMIN"]))
):
    return {"message": "Hello Manager/Admin"}