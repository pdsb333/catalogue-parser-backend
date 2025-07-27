import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.services import UserService
from app.models import User
from app.schemas import UserIn, UserUpdate
from app.core import hasher_mot_de_passe

# --- Fixtures de base ---

@pytest.fixture
def fake_user():
    """Un utilisateur simulé pour les tests."""
    return User(
        id=1,
        username="TestUser",
        email="test@example.com",
        password=hasher_mot_de_passe("strongpassword")
    )

@pytest.fixture
def user_service(mocked_session):
    """Instance de UserService avec session mockée."""
    return UserService(mocked_session)

# --- Tests unitaires ---

def test_get_user_by_email_found(user_service, mocked_session, fake_user):
    """Test récupération d'un utilisateur existant par email."""
    mocked_session.exec.return_value.first.return_value = fake_user
    user = user_service.get_user_by_email("test@example.com")
    assert user.email == "test@example.com"

def test_get_user_by_email_not_found(user_service, mocked_session):
    """Test récupération d'un utilisateur inexistant."""
    mocked_session.exec.return_value.first.return_value = None
    user = user_service.get_user_by_email("notfound@example.com")
    assert user is None

def test_create_user_success(user_service, mocked_session):
    """Test création d'un utilisateur avec un email inédit."""
    user_data = UserIn(username="NewUser", email="new@example.com", password="pass123")
    mocked_session.exec.return_value.first.return_value = None  # email pas encore utilisé

    result = user_service.create_user(user_data)
    assert result.email == "new@example.com"
    mocked_session.add.assert_called_once()
    mocked_session.commit.assert_called_once()
    mocked_session.refresh.assert_called_once()

def test_create_user_existing_email(user_service, mocked_session, fake_user):
    """Test création d'un utilisateur avec un email déjà existant."""
    user_data = UserIn(username="NewUser", email="test@example.com", password="pass123")
    mocked_session.exec.return_value.first.return_value = fake_user

    with pytest.raises(HTTPException) as exc:
        user_service.create_user(user_data)
    assert exc.value.status_code == 400
    assert exc.value.detail == "Email déjà utilisé"

def test_user_logging_success(user_service, mocked_session, fake_user):
    """Test connexion réussie d'un utilisateur."""
    mocked_session.exec.return_value.first.return_value = fake_user
    user_data = UserIn(email="test@example.com", password="strongpassword", username="TestUser")

    token = user_service.user_logging(user_data)
    assert "access_token" in token.model_dump()
    assert token.token_type == "bearer"

def test_user_logging_failure(user_service, mocked_session, fake_user):
    """Test échec de connexion avec mauvais mot de passe."""
    fake_user.password = hasher_mot_de_passe("rightpassword")
    mocked_session.exec.return_value.first.return_value = fake_user
    user_data = UserIn(email="test@example.com", password="wrongpassword", username="TestUser")

    with pytest.raises(HTTPException) as exc:
        user_service.user_logging(user_data)
    assert exc.value.status_code == 401
    assert exc.value.detail == "Identifiants invalides"
