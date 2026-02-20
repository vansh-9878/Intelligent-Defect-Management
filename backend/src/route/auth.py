from fastapi import APIRouter
from src.models.user import UserCreate, UserLogin, TokenResponse
from src.services.auth import User

router = APIRouter(prefix="/auth", tags=["Auth"])
auth_methods=User()


@router.post("/signup")
def signup(user: UserCreate):
    created_user = auth_methods.register_user(
        email=user.email,
        password=user.password,
        role=user.role,
    )

    return {"message": "User created", "user": created_user}


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin):
    token, _ = auth_methods.login_user(user.email, user.password)
    return {"access_token": token}