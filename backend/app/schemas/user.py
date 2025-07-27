from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class Tokenschema(BaseModel):
    access_token: str
    token_type: str = "bearer"
