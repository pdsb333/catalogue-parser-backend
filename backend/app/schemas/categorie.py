from typing import Optional
from pydantic import BaseModel


class CategorieBase(BaseModel):
    nom: str


class CategorieCreate(CategorieBase):
    pass  

class CategorieRead(CategorieBase):
    id: int

    class Config:
        orm_mode = True  

class CategorieUpdate(BaseModel):
    nom: Optional[str] = None
