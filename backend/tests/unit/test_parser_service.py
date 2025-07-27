import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock, call

from app.services import ParserService
from app.models import Parser
from app.schemas import ParserCreate

# === Fixtures ===

@pytest.fixture
def parser_service(mocked_session):
    """Instance of ParserService with a mocked session."""
    return ParserService(session=mocked_session)

# === Tests: get_parser_by_id ===

class TestGetParserById:
    def test_returns_parser_when_exists(self, parser_service, mocked_session):
        """Should return the parser when the ID exists."""
        mock_parser = Parser(id=1, name="Test", regex=".*", categorie_id=1, admin_id=1)
        mocked_session.get.return_value = mock_parser
        result = parser_service.get_parser_by_id(1)
        mocked_session.get.assert_called_once_with(Parser, 1)
        assert result == mock_parser

    def test_raises_404_when_not_found(self, parser_service, mocked_session):
        """Should raise a 404 error if the ID does not exist."""
        mocked_session.get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            parser_service.get_parser_by_id(999)
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Parser not found"

# === Tests: get_all_parsers ===

class TestGetAllParsers:
    def test_returns_all_parsers(self, parser_service, mocked_session):
        """Should return all existing parsers."""
        mock_parsers = [
            Parser(id=1, name="A", regex="x", categorie_id=1, admin_id=1),
            Parser(id=2, name="B", regex="y", categorie_id=1, admin_id=1),
        ]
        mocked_session.exec.return_value.all.return_value = mock_parsers        
        result = parser_service.get_all_parsers()        
        assert result == mock_parsers
        mocked_session.exec.assert_called_once()

    def test_returns_empty_list_when_no_parsers(self, parser_service, mocked_session):
        """Should return an empty list if there are no parsers."""
        mocked_session.exec.return_value.all.return_value = []
        result = parser_service.get_all_parsers()
        assert result == []

# === Tests: get_parser_by_name ===

class TestGetParserByName:
    def test_returns_parser_when_exists(self, parser_service, mocked_session):
        """Should find a parser by its name."""
        expected = Parser(id=1, name="test", regex=".*", categorie_id=1, admin_id=1)
        mocked_session.exec.return_value.first.return_value = expected
        result = parser_service.get_parser_by_name("test")
        assert result == expected

    def test_returns_none_when_not_exists(self, parser_service, mocked_session):
        """Should return None if the name does not exist."""
        mocked_session.exec.return_value.first.return_value = None
        result = parser_service.get_parser_by_name("missing")        
        assert result is None

# === Tests: create_parser ===

class TestCreateParser:
    def test_creates_parser_successfully(self, parser_service, mocker, mocked_session):
        """Should create a parser with the correct properties."""
        mocker.patch.object(parser_service, "get_parser_by_name", return_value=None)
        parser_data = ParserCreate(name="apache", categorie_id=1, extra_properties={"version": "2.4"})
        result = parser_service.create_parser(parser_data, admin_id=10)        
        mocked_session.add.assert_called_once()
        mocked_session.commit.assert_called_once()
        mocked_session.refresh.assert_called_once()
        assert result.name == "apache"
        assert result.admin_id == 10

    def test_raises_400_when_name_exists(self, parser_service, mocker):
        """Should prevent creation if the name already exists."""
        mocker.patch.object(
            parser_service, 
            "get_parser_by_name", 
            return_value=Parser(id=2, name="apache", categorie_id=1)
        )
        parser_data = ParserCreate(name="apache", categorie_id=1)
        with pytest.raises(HTTPException) as exc_info:
            parser_service.create_parser(parser_data, admin_id=1)

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Parser with this name already exists"

# === Tests: update_parser ===

class TestUpdateParser:
    def test_updates_parser_successfully(self, parser_service, mocker, mocked_session):
        """Should update all parser properties."""

        mock_parser = Parser(id=1, name="old", categorie_id=1)
        mocker.patch.object(parser_service, "get_parser_by_id", return_value=mock_parser)
        mocker.patch.object(parser_service, "get_parser_by_name", return_value=None)

        update_data = ParserCreate(name="new", categorie_id=2, extra_properties={"updated": True})
        result = parser_service.update_parser(1, update_data, admin_id=10)
        assert result is mock_parser
        assert result.name == "new"
        assert result.categorie_id == 2
        assert result.admin_id == 10


    def test_raises_404_when_parser_not_found(self, parser_service, mocker):
        """Should fail if the parser does not exist."""
        mocker.patch.object(parser_service, "get_parser_by_id", return_value=None)
        update_data = ParserCreate(name="n/a", categorie_id=0)
        with pytest.raises(HTTPException) as exc_info:
            parser_service.update_parser(999, update_data, admin_id=10)
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Parser not found"

    def test_updates_parser_without_changing_name(self, parser_service, mocker):
        """If we keep the same name but modify something else (such as categorie_id), it should be allowed."""
        mock_parser = Parser(id=1, name="same-name", categorie_id=1)

        mocker.patch.object(parser_service, "get_parser_by_id", return_value=mock_parser)
        mocker.patch.object(parser_service, "get_parser_by_name", return_value=mock_parser)

        update_data = ParserCreate(name="same-name", categorie_id=2)

        result = parser_service.update_parser(1, update_data, admin_id=42)

        assert result.name == "same-name"
        assert result.categorie_id == 2
        assert result.admin_id == 42


# === Tests: delete_parser ===

class TestDeleteParser:
    def test_deletes_parser_successfully(self, parser_service, mocker, mocked_session):
        """Should delete the existing parser."""
        mock_parser = Parser(id=1, name="todelete")
        mocker.patch.object(parser_service, "get_parser_by_id", return_value=mock_parser)
        parser_service.delete_parser(1)
        mocked_session.delete.assert_called_once_with(mock_parser)
        mocked_session.commit.assert_called_once()

    def test_raises_404_when_parser_not_found(self, parser_service, mocker):
        """Should fail if the parser does not exist."""
        mocker.patch.object(parser_service, "get_parser_by_id", return_value=None)
        with pytest.raises(HTTPException) as exc_info:
            parser_service.delete_parser(999)
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Parser not found"
