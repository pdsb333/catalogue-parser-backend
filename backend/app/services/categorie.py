from sqlmodel import Session, select
from fastapi import HTTPException
from app.models import Categorie, Parser
from app.schemas import CategorieCreate, CategorieUpdate, CategorieWithParsers, ParserRead


class CategorieService:
    """
    Category management service.
    Contains CRUD operations on the Categorie model,
    as well as cascading deletion of associated parsers.
    """

    def __init__(self, session: Session):
        self.session = session

    def get_all_categorie(self) -> list[Categorie]:
        """
        Retrieves all categories from the database.
        """
        cat = self.session.exec(select(Categorie)).all()
        if not cat:
            raise HTTPException(400, "Categorie not found")
        return cat
    
    def get_all_categories_with_parsers(self) -> list[CategorieWithParsers]:
        categories = self.get_all_categorie()
        return sorted([
            CategorieWithParsers(
                name=cat.name,
                parsers=sorted(
                    [
                        ParserRead(
                            id=parser.id,
                            name=parser.name,
                            admin_id = parser.admin_id,
                            categorie_id=parser.categorie_id,
                            extra_properties=parser.extra_properties
                        )
                        for parser in cat.parsers
                    ],
                    key=lambda p: p.name.lower()
                )
            )
            for cat in categories
        ], key=lambda c: c.name.lower())


    def get_categorie_by_id(self, categorie_id: int) -> Categorie:
        """
        Retrieves a category by its ID.
        Raises an exception if the category does not exist.
        """
        cat = self.session.get(Categorie, categorie_id)
        if not cat:
            raise HTTPException(400, "Categorie not found")
        return cat

    def get_categorie_by_name(self, name: str) -> Categorie | None:
        """
        Retrieves a category by its name.
        Returns None if it does not exist.
        """
        statement = select(Categorie).where(Categorie.name == name)
        result = self.session.exec(statement).first()
        if not result:
            raise HTTPException(400, "Categorie not found")
        return result

    def create_categorie(self, categorie_data: CategorieCreate, admin_id: int) -> Categorie:
        """
        Creates a new category.
        First checks that a category with the same name does not already exist.
        """
        # Check for name uniqueness
        existingname = self.get_categorie_by_name(categorie_data.name)
        if existingname is not None:
            raise HTTPException(status_code=400, detail="Categorie name already exists")

        # Create the Categorie object
        categorie = Categorie(**categorie_data.model_dump(), admin_id=admin_id)

        # Persist to the database
        self.session.add(categorie)
        self.session.commit()
        self.session.refresh(categorie)
        return categorie

    def update_categorie(self, cat_id: int, cat_in: CategorieUpdate, admin_id: int) -> Categorie:
        """
        Updates an existing category.
        Checks for category existence and name uniqueness.
        """
        db_cat = self.session.get(Categorie, cat_id)
        if not db_cat:
            raise HTTPException(404, "Catégorie non trouvée")

        update_data = cat_in.model_dump(exclude_unset=True)

        # Check that the new name does not belong to another category
        existing = self.get_categorie_by_name(cat_in.name)
        if existing is not None and existing.id != cat_id:
            raise HTTPException(status_code=400, detail="Categorie name already exists")

        # Apply updates
        for k, v in update_data.items():
            setattr(db_cat, k, v)
        db_cat.admin_id = admin_id
        self.session.commit()
        self.session.refresh(db_cat)
        return db_cat

    def delete_categorie(self, categorie_id: int):
        """
        Deletes a category and moves all parsers associated with it to the 'archive' category.
        Raises an error if the category does not exist.
        """
        # 1. Récupérer la catégorie à supprimer
        categorie = self.get_categorie_by_id(categorie_id)
        if not categorie:
            raise ValueError("Catégorie introuvable")

        # 2. Récupérer les parsers liés à la catégorie
        parsers_stmt = select(Parser).where(Parser.categorie_id == categorie_id)
        parsers = self.session.exec(parsers_stmt).all()

        # 3. S'assurer que la catégorie 'archive' existe
        archive_stmt = select(Categorie).where(Categorie.name == "archive")
        archive_categorie = self.session.exec(archive_stmt).first()
        if not archive_categorie:
            archive_categorie = Categorie(name="archive", admin_id=1)
            self.session.add(archive_categorie)
            self.session.commit()  # Pour générer l'ID
            self.session.refresh(archive_categorie)

        # 4. Réaffecter les parsers à 'archive'
        for parser in parsers:
            parser.categorie_id = archive_categorie.id
            self.session.add(parser)
        self.session.flush()  

        # 5. Supprimer la catégorie
        self.session.delete(categorie)
        self.session.commit()

        return {"detail": "Categorie deleted. Parsers moved to 'archive'"}