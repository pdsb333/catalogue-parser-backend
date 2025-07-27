from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.services import UserService
from app.schemas import UserIn, Tokenschema
from app.core import get_session
import os

APP_ENV = os.getenv("APP_ENV", "production")

router = APIRouter(prefix="/login", tags=["login"])

def get_user_service(session=Depends(get_session)):
    return UserService(session)

def build_user_data(form_data):
    return UserIn(email=form_data.username, password=form_data.password)

if APP_ENV == "production":
    @router.post("/", response_model=dict)
    def login(
        response: Response,
        form_data: OAuth2PasswordRequestForm = Depends(),
        service: UserService = Depends(get_user_service)
    ):
        user_data = build_user_data(form_data)
        token = service.user_logging(user_data)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,  
            samesite="Lax",
            max_age=1800
        )
        return {"message": "Connexion réussie"}
else:
    @router.post("/", response_model=Tokenschema)
    def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        service: UserService = Depends(get_user_service)
    ):
        user_data = build_user_data(form_data)
        return service.user_logging(user_data)
