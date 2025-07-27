import pytest
from fastapi import HTTPException

from app.services import CategorieService
from app.models import Categorie, Parser
from app.schemas import CategorieCreate, CategorieUpdate

# === Fixtures ===

@pytest.fixture
def categorie_service(mocked_session):
    return CategorieService(session=mocked_session)

# === Tests: get_categorie_by_id ===

class TestGetCategorieById:
    def test_returns_categorie_if_exists(self, categorie_service, mocked_session):
        """Should return the category if it exists."""

        mock_categorie = Categorie(id=1, name="Test")
        mocked_session.get.return_value = mock_categorie
        result = categorie_service.get_categorie_by_id(1)
        assert result == mock_categorie
        mocked_session.get.assert_called_once_with(Categorie, 1)

    def test_raises_exception_if_not_found(self, categorie_service, mocked_session):
        """Should raise HTTPException if category not found."""

        mocked_session.get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            categorie_service.get_categorie_by_id(999)
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Categorie not found"

# === Tests: get_all_categorie ===

class TestGetAllCategorie:
    def test_returns_all_categories(self, categorie_service, mocked_session):
        """Should return all categories."""

        mock_categories = [Categorie(id=1, name="Cat1"), Categorie(id=2, name="Cat2")]
        mocked_session.exec.return_value.all.return_value = mock_categories
        result = categorie_service.get_all_categorie()
        assert result == mock_categories
        mocked_session.exec.assert_called_once()

    def test_returns_empty_list_if_no_categories(self, categorie_service, mocked_session):
        """Should return an empty list if no categories."""

        mocked_session.exec.return_value.all.return_value = []
        result = categorie_service.get_all_categorie()
        assert result == []

# === Tests: create_categorie ===

class TestCreateCategorie:
    def test_raises_if_name_already_exists(self, categorie_service, mocker):
        """Should raise if category name already exists."""

        mocker.patch.object(
            categorie_service, "get_categorie_by_name", return_value=Categorie(id=1, name="Existing")
        )
        data = CategorieCreate(name="Existing")
        with pytest.raises(HTTPException) as exc_info:
            categorie_service.create_categorie(data, admin_id=1)
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Categorie name already exists"

    def test_creates_categorie_successfully(self, categorie_service, mocked_session):
        """Should create category successfully."""

        mocked_session.exec.return_value.first.return_value = None
        data = CategorieCreate(name="NewCat")
        result = categorie_service.create_categorie(data, admin_id=1)
        assert result.name == "NewCat"
        mocked_session.add.assert_called_once()
        mocked_session.commit.assert_called_once()
        mocked_session.refresh.assert_called_once_with(result)

# === Tests: update_categorie ===

class TestUpdateCategorie:
    def test_raises_if_new_name_exists(self, categorie_service, mocked_session):
        """Should raise if new category name already exists."""

        current = Categorie(id=1, name="OldCat")
        mocked_session.get.return_value = current
        mocked_session.exec.return_value.first.return_value = Categorie(id=2, name="Existing")
        data = CategorieUpdate(name="Existing")
        with pytest.raises(HTTPException) as exc_info:
            categorie_service.update_categorie(1, data, admin_id =1)
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Categorie name already exists"

    def test_updates_categorie_successfully(self, categorie_service, mocked_session):
        """Should update category successfully."""

        current = Categorie(id=1, name="OldCat")
        mocked_session.get.return_value = current
        mocked_session.exec.return_value.first.return_value = None
        data = CategorieUpdate(name="NewCat")
        result = categorie_service.update_categorie(1, data, admin_id = 1)
        assert result.name == "NewCat"
        mocked_session.commit.assert_called_once()
        mocked_session.refresh.assert_called_once_with(current)

# === Tests: delete_categorie ===

class TestDeleteCategorie:
    def test_removes_parsers_and_categorie(self, categorie_service, mocked_session):
        """Should remove all parsers and the category."""

        mock_parser1 = Parser(id=1, name="P1", regex=".*", categorie_id=1, admin_id=1)
        mock_parser2 = Parser(id=2, name="P2", regex=".*", categorie_id=1, admin_id=1)
        mock_categorie = Categorie(id=1, name="ToDelete")

        mocked_session.get.return_value = mock_categorie
        mocked_session.exec.return_value.all.return_value = [mock_parser1, mock_parser2]

        result = categorie_service.delete_categorie(1)

        mocked_session.delete.assert_any_call(mock_parser1)
        mocked_session.delete.assert_any_call(mock_parser2)
        mocked_session.delete.assert_any_call(mock_categorie)
        mocked_session.commit.assert_called_once()

        assert result == {"detail": "Categorie and its parsers deleted"}

    def test_raises_if_categorie_not_found(self, categorie_service, mocked_session):
        """Should raise if category not found."""
        
        mocked_session.get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            categorie_service.delete_categorie(999)

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Categorie not found"



def test_sql_injection_protection(categorie_service):
    malicious_name = "'; DROP TABLE categorie; --"
    with pytest.raises(HTTPException):
        categorie_service.create_categorie(CategorieCreate(name=malicious_name), admin_id=1)