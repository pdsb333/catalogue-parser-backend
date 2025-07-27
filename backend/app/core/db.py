from sqlmodel import create_engine, Session
from dotenv import load_dotenv 
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
APP_ENV = os.getenv("APP_ENV", "development")

if APP_ENV == "development":
    engine = create_engine(DATABASE_URL, echo=True)
else:
    engine = create_engine(DATABASE_URL, echo=False)


def get_session() -> Session:

    with Session(engine) as session:
        yield session




