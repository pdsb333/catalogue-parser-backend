from sqlmodel import Field, SQLModel, Relationship 
from typing import List
from .parsers import Parser

class Categorie(SQLModel, table=True):
    __tablename__="categorie"

    id: int | None = Field(default=None, primary_key=True)
    nom:str = Field(index=True)
    
    parsers: List["Parser"] = Relationship(back_populates="categorie")


