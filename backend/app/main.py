from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes import parser_router, categorie_router, login, users


app = FastAPI(
    title="Catalogue Parser API",
   #displayed for demo purposes, but should be disabled in production for security reasons
    description="API pour parser les catalogues de produits et gérer les utilisateurs",
   # docs_url=None if os.getenv("APP_ENV") == "production" else "/docs",
   # redoc_url=None if os.getenv("APP_ENV") == "production" else "/redoc",
   # openapi_url=None if os.getenv("APP_ENV") == "production" else "/openapi.json",
)


origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,          
    allow_methods=["*"],            
    allow_headers=["Authorization", "X-Custom-Header", "Content-Type"],
)
    

app.include_router(parser_router)
app.include_router(categorie_router)
app.include_router(login)
app.include_router(users)

@app.get("/health")
def health():
    return {"status": "ok"}


