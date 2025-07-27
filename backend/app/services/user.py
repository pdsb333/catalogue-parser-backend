from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.models import User
from app.schemas import UserOut, UserIn, UserUpdate, Tokenschema
from app.core import verifier_mot_de_passe, creer_token, hasher_mot_de_passe
import os

APP_ENV = os.getenv("APP_ENV", "production")


class UserService:
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        return self.session.get(User, user_id)

    def get_all_users(self) -> list[UserOut]:
        return self.session.exec(select(User)).all()

    def user_logging(self, user_data: UserIn):
        user = self.get_user_by_email(user_data.email)
        if not user or not verifier_mot_de_passe(user_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiants invalides",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token = creer_token({"sub": user.email})
        # Condition sur l'environnement ici
        app_env = os.getenv("APP_ENV", "production")
        if app_env == "production":
            return token
        else:
            return Tokenschema(access_token=token, token_type="bearer")
        

    def create_user(self, user_data: UserIn) -> UserOut:
        existing_user = self.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email déjà utilisé")

        hashed_password = hasher_mot_de_passe(user_data.password)
        user = User(**user_data.model_dump(exclude={"password"}), password=hashed_password)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update_user(self, user_id: int, update_data: UserUpdate) -> UserOut:
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        update_data_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_data_dict.items():
            if key == "password":
                value = hasher_mot_de_passe(value)
            setattr(user, key, value)

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete_user(self, user_id: int) -> dict:
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        self.session.delete(user)
        self.session.commit()
        return {"detail": "Utilisateur supprimé"}
