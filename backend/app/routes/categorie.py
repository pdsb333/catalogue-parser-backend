from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.models import User
from app.schemas import (
    CategorieRead, CategorieCreate, CategorieUpdate, CategorieBase, CategorieWithParsers
)
from app.core import get_session, get_current_admin
from app.services import CategorieService

router = APIRouter(prefix="/categories", tags=["categories"])

def service(session: Session = Depends(get_session)) -> CategorieService:
    return CategorieService(session)

# ----------- PUBLIC ROUTES -----------

@router.get("/", response_model=list[CategorieRead])
def read_categorie_public(service: CategorieService = Depends(service)):
    """Accessible à tous : liste simplifiée des catégories."""
    return service.get_all_categorie()

@router.get("/parsers", response_model=list[CategorieWithParsers])
def list_categories_with_parsers(session: Session = Depends(get_session)):
    service = CategorieService(session)
    return service.get_all_categories_with_parsers()


# ----------- ADMIN ROUTES -----------

@router.get("/admin", response_model=list[CategorieRead])
def read_categorie_admin(
    service: CategorieService = Depends(service),
    admin: User = Depends(get_current_admin)
):
    """Accessible uniquement aux admins : liste détaillée."""
    return service.get_all_categorie()

@router.post("/admin", response_model=CategorieRead)
def create_categorie(
    categorie_in: CategorieCreate, 
    service: CategorieService = Depends(service),
    admin: User = Depends(get_current_admin)
):
    """Création d'une catégorie (admin uniquement)."""
    return service.create_categorie(categorie_in, admin_id=admin.id)

@router.patch("/admin/{cat_id}", response_model=CategorieRead)
def update_categorie(
    cat_id: int,
    cat_in: CategorieUpdate,
    service: CategorieService = Depends(service), 
    admin: User = Depends(get_current_admin)
):
    """Mise à jour d'une catégorie (admin uniquement)."""
    return service.update_categorie(cat_id, cat_in, admin_id=admin.id)

@router.delete("/admin/{cat_id}")
def delete_categorie(
    cat_id: int,
    service: CategorieService = Depends(service),
    admin: User = Depends(get_current_admin)
):
    """Suppression d'une catégorie (admin uniquement)."""
    service.delete_categorie(cat_id)
    return {"detail": "Catégorie supprimée"}
