from typing import Optional, Dict, Any
from pydantic import BaseModel

class ParserBase(BaseModel):
    name: str
    categorie_id: Optional[int]
    extra_properties: Dict[str, Any] = {}

class ParserCreate(ParserBase):
    pass  

class ParserRead(ParserBase):
    id: int
    admin_id: int

    class Config:
        orm_mode = True

class ParserUpdate(BaseModel):
    name: Optional[str] = None
    categorie_id: Optional[int] = None
    extra_properties: Optional[Dict[str, Any]] = None