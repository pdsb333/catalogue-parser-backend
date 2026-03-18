from sqlmodel import create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
APP_ENV = os.getenv("APP_ENV", "development")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

if APP_ENV != "development" and "sslmode" not in DATABASE_URL:
    DATABASE_URL += "?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    echo=(APP_ENV == "development"),
)

def get_session() -> Session:
    with Session(engine) as session:
        yield session