from .parser import router as parser_router
from .categorie import router as categorie_router
from .auth import router as login
from .user import router as users


__all__ = [
    "parser_router", "categorie_router", "login", "users"
]
