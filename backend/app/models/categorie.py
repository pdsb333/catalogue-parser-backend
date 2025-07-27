from sqlmodel import Field, SQLModel, Relationship 
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.parser import Parser
    from app.models.user import User

class Categorie(SQLModel, table=True):
    __tablename__="categorie"

    id: int | None = Field(default=None, primary_key=True)
    name:str = Field(index=True)
    admin_id: int = Field(foreign_key="user.id")
    parsers: List["Parser"] = Relationship(back_populates="categories")


    admin: Optional["User"] = Relationship(back_populates="categories")
