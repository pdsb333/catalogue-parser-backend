from unittest.mock import MagicMock
import os
import pytest
from sqlmodel import SQLModel, create_engine, Session
from fastapi.testclient import TestClient
from app.main import app
from app.core import get_session, creer_token, get_current_admin
from app.models import User, Categorie, Parser

# Fixture for mocking a SQLModel session (not used in the other fixtures)
@pytest.fixture
def mocked_session():
    return MagicMock()

# Create a test database engine using the environment variable
DATABASE_URL = os.getenv("DATABASE_URL_TEST")
engine = create_engine(DATABASE_URL)

# Creates and drops all tables once per test session
@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)

# Provides a session for each test function
@pytest.fixture(scope="function")
def session():
    with Session(engine) as session:
        yield session

# Cleans all tables after each test function
@pytest.fixture(autouse=True, scope="function")
def clean_tables(session):
    yield
    for table in reversed(SQLModel.metadata.sorted_tables):
        session.execute(table.delete())
    session.commit()

# Provides a TestClient with dependency override for the database session
@pytest.fixture(scope="function")
def client(session):
    def override_get_session():
        yield session
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# Provides an authenticated client with a valid token and current user override
@pytest.fixture
def auth_client(session):
    user = User(
        username="admin_auth",
        email="admin_auth@example.com",
        password="fakehashed"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    # Generate a token for the user
    token = creer_token(data={"sub": user.email})
    # Override dependencies
    def override_get_session():
        yield session
    def override_get_current_admin():
        return user
    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    # Setup TestClient with Authorization header
    client = TestClient(app)
    client.headers.update({
        "Authorization": f"Bearer {token}"
    })
    yield client, user
    app.dependency_overrides.clear()

# Creates and returns a user element
@pytest.fixture
def user_elmt(session): 
    user = User(
        username="admin",
        email="admin@example.com",
        password="fakehashed"
    )    
    session.add(user)
    session.commit()
    session.refresh(user)
    yield user


# Creates and returns a Categorie linked to a user
@pytest.fixture
def categorie_elmt(session, user_elmt): 
    categorie = Categorie(name="categorie test", admin_id=user_elmt.id)
    session.add(categorie)
    session.commit()
    session.refresh(categorie)
    yield categorie

# Creates and returns a Parser linked to a Categorie and a User
@pytest.fixture
def parser_elmt(session, categorie_elmt, user_elmt):
    parser = Parser(
        name="test parser",
        extra_properties={"pattern": "regex"},
        categorie_id=categorie_elmt.id,
        admin_id=user_elmt.id
    )
    session.add(parser)
    session.commit()
    session.refresh(parser)
    yield parser
