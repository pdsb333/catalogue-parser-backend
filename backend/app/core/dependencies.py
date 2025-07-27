from fastapi import Depends, Request, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from app.core import get_session, SECRET_KEY, ALGORITHM
from app.models import User
import os

APP_ENV = os.getenv("APP_ENV", "production")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_admin_from_cookie(request: Request, session: Session):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    admin = session.exec(select(User).where(User.email == email)).first()
    if not admin:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return admin

def get_admin_from_bearer(token: str, session: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="identifiant invalide")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")
    admin = session.exec(select(User).where(User.email == email)).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable")
    return admin

if APP_ENV == "production":
    def get_current_admin(request: Request, session: Session = Depends(get_session)):
        return get_admin_from_cookie(request, session)
else:
    def get_current_admin(
        session: Session = Depends(get_session),
        token: str = Depends(oauth2_scheme)
    ):
        return get_admin_from_bearer(token, session)
    






