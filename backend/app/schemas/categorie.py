from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.parser import ParserRead


class CategorieBase(BaseModel):
    name: str

class CategorieCreate(CategorieBase):
    pass  

class CategorieWithParsers(CategorieBase):
    parsers: List[ParserRead]
    model_config = ConfigDict(from_attributes=True)

class CategorieRead(CategorieBase):
    id: int
    admin_id: int
    model_config = ConfigDict(from_attributes=True)

class CategorieUpdate(BaseModel):
    name: Optional[str] = None
