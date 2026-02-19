from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from src.core.config import settings

from src.logger import logging

class Security:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self,password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self,plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(self,data: dict, expires_delta: timedelta | None = None):
        logging.info("Creating access token")
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.now() + expires_delta
        else:
            expire = datetime.now() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )

        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET,
            algorithm=settings.ALGORITHM,
        )
        
        logging.info("Access token created")

        return encoded_jwt


    def decode_token(self,token: str):
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.ALGORITHM],
            )
            logging.info("decoded the payload successfully")
            return payload
        except JWTError:
            return None
