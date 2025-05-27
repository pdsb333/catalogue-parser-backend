from typing import Optional, Dict, Any, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB 
from sqlalchemy import Column 

if TYPE_CHECKING:
    from app.models.categories import Categorie
    from app.models.users import User

class Parser(SQLModel, table=True):
    __tablename__="parser"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    categorie_id: int = Field(foreign_key="categorie.id")    
    admin_id: int = Field(foreign_key="user.id")
    extra_properties: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False)
    )

    categorie: Optional["Categorie"] = Relationship(back_populates="parsers")
    admin: Optional["User"] = Relationship(back_populates="parsers")


