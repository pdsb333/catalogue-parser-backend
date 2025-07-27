from sqlmodel import Session, select
from fastapi import HTTPException
from app.models import Parser, Categorie
from app.schemas.parser import ParserCreate
from app.services.categorie import CategorieService


class ParserService:
    """
    Business service for managing CRUD operations on Parsers.
    """

    def __init__(self, session: Session):
        self.session = session

    def get_parser_by_id(self, parser_id: int) -> Parser:
        """
        Retrieve a Parser by its ID.
        Raises an HTTP 404 exception if the Parser does not exist.
        """
        parser = self.session.get(Parser, parser_id)
        if parser is None:
            raise HTTPException(status_code=404, detail="Parser not found")
        return parser

    def get_parser_by_name(self, name: str) -> Parser | None:
        """
        Search for a Parser by its name.
        Returns None if no Parser matches.
        """
        statement = select(Parser).where(Parser.name == name)
        result = self.session.exec(statement).first()
        return result

    def get_all_parsers(self, limit:int, offset: int) -> list[Parser]:
        """
        Returns the list of all Parsers in the database.
        """
        query = select(Parser).offset(offset).limit(limit)
        return self.session.exec(query).all()
    
    def get_parsers_by_categorie(self, categorie_id: int, limit: int, offset: int) -> list[Parser]:
        statement = (
            select(Parser)
            .where(Parser.categorie_id == categorie_id)
            .offset(offset)
            .limit(limit)
        )
        parsers = self.session.exec(statement).all()
        if not parsers:
            raise HTTPException(status_code=404, detail="Dont have any data")

        return parsers


    def create_parser(self, parser_data: ParserCreate, admin_id: int) -> Parser:
        """
        Creates a new Parser.
        Checks that the name does not already exist.
        Checks that the associated category exists.
        """
        existingname = self.get_parser_by_name(parser_data.name)
        if existingname:
            raise HTTPException(status_code=400, detail="Parser with this name already exists")

        categorie_service = CategorieService(self.session)
        existingcat = categorie_service.get_categorie_by_id(parser_data.categorie_id)
        if not existingcat:
            raise HTTPException(status_code=400, detail="Categorie not found")

        parser = Parser(**parser_data.model_dump(), admin_id=admin_id)
        self.session.add(parser)
        self.session.commit()
        self.session.refresh(parser)
        return parser

    def update_parser(self, parser_id: int, parser_in: ParserCreate, admin_id: int) -> Parser:
        """
        Updates an existing Parser.
        """
        parser = self.get_parser_by_id(parser_id)
        if not parser:
            raise HTTPException(status_code=404, detail="Parser not found")
        update_data = parser_in.model_dump(exclude_unset=True)

        existing = self.get_parser_by_name(parser_in.name)
        if existing is not None and existing.id != parser_id:
            raise HTTPException(status_code=400, detail="Parser name already exists")
        

        for key, val in update_data.items():
            setattr(parser, key, val)
        parser.admin_id = admin_id
        self.session.add(parser)
        self.session.commit()
        self.session.refresh(parser)
        return parser

    def delete_parser(self, parser_id: int):
        """
        Deletes a Parser by its ID.

        Raises a 404 exception if the Parser does not exist.
        Commits the deletion.
        """
        parser = self.get_parser_by_id(parser_id)
        if not parser:
            raise HTTPException(status_code=404, detail="Parser not found")
        self.session.delete(parser)
        self.session.commit()
