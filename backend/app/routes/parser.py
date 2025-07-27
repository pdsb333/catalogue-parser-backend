from fastapi import APIRouter, Depends, Query, status, Path
from sqlmodel import Session
from app.models import User
from app.schemas import ParserRead, ParserCreate, ParserUpdate, ParserBase
from app.core import get_session, get_current_admin
from app.services import ParserService

router = APIRouter(prefix="/parsers", tags=["parsers"])

def get_parser_service(session: Session = Depends(get_session)) -> ParserService:
    return ParserService(session)

# ----------- PUBLIC ROUTES -----------

@router.get("/by-categorie/{categorie_id}", response_model=list[ParserRead])
def read_parsers_by_categorie(
    limit: int = Query(20, ge=1, le=100, description="Nombre maximal d'éléments à retourner"),
    offset: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    categorie_id: int = Path(..., description="ID de la catégorie à filtrer"),
    service: ParserService = Depends(get_parser_service)
):
    """Liste publique des parsers d'une catégorie."""
    return service.get_parsers_by_categorie(categorie_id, limit=limit, offset=offset)

# ----------- ADMIN ROUTES -----------

@router.get("/admin", response_model=list[ParserRead])
def read_parsers_admin(
    admin: User = Depends(get_current_admin),
    limit: int = Query(20, ge=1, le=100, description="Nombre maximal d'éléments à retourner"),
    offset: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    service: ParserService = Depends(get_parser_service)
):
    """Liste détaillée des parsers (admin)."""
    return service.get_all_parsers(limit=limit, offset=offset)

@router.get("/admin/{parser_id}", response_model=ParserRead)
def read_parser_by_id(
    parser_id: int,
    admin: User = Depends(get_current_admin),
    service: ParserService = Depends(get_parser_service)
):
    """Détail d'un parser (admin)."""
    return service.get_parser_by_id(parser_id)

@router.get("/admin/by-categorie/{categorie_id}", response_model=list[ParserRead])
def read_parsers_by_categorie_admin(
    admin: User = Depends(get_current_admin),
    limit: int = Query(20, ge=1, le=100, description="Nombre maximal d'éléments à retourner"),
    offset: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    categorie_id: int = Path(..., description="ID de la catégorie à filtrer"),
    service: ParserService = Depends(get_parser_service)
):
    """Liste détaillée des parsers d'une catégorie (admin)."""
    return service.get_parsers_by_categorie(categorie_id, limit=limit, offset=offset)


@router.post("/admin/", response_model=ParserRead, status_code=status.HTTP_201_CREATED)
def create_parser(
    parser_in: ParserCreate,
    admin: User = Depends(get_current_admin),
    service: ParserService = Depends(get_parser_service)
):
    """Créer un parser (admin)."""
    return service.create_parser(parser_in, admin_id=admin.id)

@router.patch("/admin/{parser_id}", response_model=ParserRead)
def update_parser(
    parser_id: int,
    parser_in: ParserUpdate,
    admin: User = Depends(get_current_admin),
    service: ParserService = Depends(get_parser_service)
):
    """Modifier un parser (admin)."""
    return service.update_parser(parser_id, parser_in, admin_id=admin.id)

@router.delete("/admin/{parser_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_parser(
    parser_id: int,
    admin: User = Depends(get_current_admin),
    service: ParserService = Depends(get_parser_service)
):
    """Supprimer un parser (admin)."""
    service.delete_parser(parser_id)
