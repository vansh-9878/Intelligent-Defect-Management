from fastapi import HTTPException, status
from src.logger import logging
from src.db.supabase_client import SupabaseClient
from src.core.security import Security
from supabase import Client

class User:
    def __init__(self):
        self.supabase:Client=SupabaseClient().client
        self.security=Security()

    def register_user(self,email: str, password: str, role: str):
        try:
            existing = self.supabase.table("users").select("*").eq("email", email).execute()
            if existing.data:
                logging.info("User already exists")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already exists",
                )

            hashed_pw = self.security.hash_password(password)

            result = (
                self.supabase.table("users")
                .insert(
                    {
                        "email": email,
                        "hashed_password": hashed_pw,
                        "role": role,
                    }
                )
                .execute()
            )
            logging.info("New User has been registered successfully")

            return result.data[0]
        except Exception as e:
            logging.error("Could not register user : %s",e)

    def login_user(self,email: str, password: str):
        try:
            user_res = self.supabase.table("users").select("*").eq("email", email).execute()

            if not user_res.data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            user = user_res.data[0]

            if not self.security.verify_password(password, user["hashed_password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )

            token = self.security.create_access_token(
                {
                    "sub": user["id"],
                    "role": user["role"],
                    "email": user["email"],
                }
            )
            logging.info("User has been logged in")
            return token, user
        except Exception as e:
            logging.error("Could not login : %s",e)


