from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.schemas import UserOut, UserIn, UserUpdate
from app.services import UserService
from app.models import User
from app.core import get_session, get_current_admin

router = APIRouter(prefix="/users", tags=["Users"])

def service(session: Session = Depends(get_session), admin: User = Depends(get_current_admin)) -> UserService:
    return UserService(session)


@router.get("/", response_model=list[UserOut])
def get_all_users(
    session: UserService = Depends(service),
    admin: User = Depends(get_current_admin)
):
    return session.get_all_users()



@router.post("/", response_model=UserOut, status_code=201)
def create_user(
    user_in: UserIn, 
    session: UserService = Depends(service), 
    admin: User = Depends(get_current_admin)
):
    return session.create_user(user_in)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, 
    update_data: UserUpdate, 
    session: UserService = Depends(service), 
    admin: User = Depends(get_current_admin)
):
    return session.update_user(user_id, update_data)


@router.delete("/{user_id}")
def delete_user(
    user_id: int, 
    session: UserService = Depends(service), 
    admin: User = Depends(get_current_admin)
):
    return session.delete_user(user_id)