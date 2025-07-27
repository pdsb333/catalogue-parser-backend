from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.parser import Parser
    from app.models.categorie import Categorie

class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    password: str
    email: str = Field(index=True, unique=True) 

    parsers: List["Parser"] = Relationship(back_populates="admin")
    categories: List["Categorie"] = Relationship(back_populates="admin")
