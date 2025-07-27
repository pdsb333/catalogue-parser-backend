# ==============================
# 🔍 TESTS LECTURE (GET)
# ==============================

# ✅ Liste des parsers - sans authentification
def test_read_parsers_unauthenticated(client):
    response = client.get("/parsers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# ✅ Liste des parsers - avec authentification
def test_read_parsers_authenticated(auth_client):
    client, _ = auth_client
    response = client.get("/parsers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# ✅ Détail d’un parser - sans authentification
def test_read_parser_by_id_unauthenticated(client, parser_elmt):
    response = client.get(f"/parsers/{parser_elmt.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == parser_elmt.id
    assert data["name"] == parser_elmt.name
    assert data["admin_id"] == parser_elmt.admin_id
    assert data["categorie_id"] == parser_elmt.categorie_id
    assert data["extra_properties"] == parser_elmt.extra_properties

# ✅ Détail d’un parser - avec authentification
def test_read_parser_by_id_authenticated(auth_client, parser_elmt):
    client, _ = auth_client
    response = client.get(f"/parsers/{parser_elmt.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == parser_elmt.id
    assert data["name"] == parser_elmt.name
    assert data["admin_id"] == parser_elmt.admin_id
    assert data["categorie_id"] == parser_elmt.categorie_id
    assert data["extra_properties"] == parser_elmt.extra_properties

# ❌ Détail d’un parser inexistant
def test_read_nonexistent_parser(client):
    response = client.get("/parsers/999999")
    assert response.status_code == 404

# ==============================
# 🆕 TESTS CRÉATION (POST)
# ==============================

# ❌ Création non authentifiée
def test_create_parser_unauthenticated(client, categorie_elmt):
    payload = {
        "name": "unauth_parser",
        "extra_properties": {"pattern": "regex"},
        "categorie_id": categorie_elmt.id
    }
    response = client.post("/parsers/", json=payload)
    assert response.status_code == 401  # ou 403 selon ta config

# ✅ Création authentifiée
def test_create_parser_authenticated(categorie_elmt, auth_client):
    client, user = auth_client
    payload = {
        "name": "secure_parser",
        "extra_properties": {"pattern": "regex"},
        "categorie_id": categorie_elmt.id
    }
    response = client.post("/parsers/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "secure_parser"
    assert data["extra_properties"] == {"pattern": "regex"}
    assert data["categorie_id"] == categorie_elmt.id
    assert data["admin_id"] == user.id

# ❌ Création sans nom
def test_create_parser_missing_name(auth_client):
    client, _ = auth_client
    payload = {
        "extra_properties": {"pattern": "regex"},
        "categorie_id": 1
    }
    response = client.post("/parsers/", json=payload)
    assert response.status_code == 422

# ❌ Création avec catégorie invalide
def test_create_parser_invalid_categorie(auth_client):
    client, _ = auth_client
    payload = {
        "name": "parser_test",
        "extra_properties": {"pattern": "regex"},
        "categorie_id": 9999
    }
    response = client.post("/parsers/", json=payload)
    assert response.status_code in [400, 404]

# ❌ Création avec extra_properties invalide
def test_create_parser_invalid_extra_properties(auth_client, categorie_elmt):
    client, _ = auth_client
    payload = {
        "name": "parser_invalid_props",
        "extra_properties": "not_a_dict",
        "categorie_id": categorie_elmt.id
    }
    response = client.post("/parsers/", json=payload)
    assert response.status_code == 422

# ==============================
# ✏️ TESTS MISE À JOUR (PATCH)
# ==============================

# ✅ Modification autorisée
def test_update_parser_success(parser_elmt, auth_client):
    client, _ = auth_client
    payload = {
        "name": "new name",
        "extra_properties": {"new key": "newkey"},
    }
    response = client.patch(f"/parsers/{parser_elmt.id}", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "new name"
    assert data["extra_properties"] == payload["extra_properties"]
    assert data["categorie_id"] == parser_elmt.categorie_id

# ❌ Modification non authentifiée
def test_update_parser_unauthenticated(parser_elmt, client):
    payload = {
        "name": "new name",
        "extra_properties": {"new key": "newkey"},
    }
    response = client.patch(f"/parsers/{parser_elmt.id}", json=payload)
    assert response.status_code == 401

# ❌ Tentative de modification d’un champ interdit
def test_update_parser_readonly_field(parser_elmt, auth_client):
    client, user = auth_client
    payload = {
        "admin_id": 999
    }
    response = client.patch(f"/parsers/{parser_elmt.id}", json=payload)
    data = response.json()
    assert data["admin_id"] == user.id
# ==============================
# 🗑️ TESTS SUPPRESSION (DELETE)
# ==============================

# ✅ Suppression authentifiée
def test_delete_parser_authenticated(parser_elmt, auth_client):
    client, _ = auth_client
    response = client.delete(f"/parsers/{parser_elmt.id}")
    assert response.status_code == 204
    get_response = client.get(f"/parsers/{parser_elmt.id}")
    assert get_response.status_code == 404

# ❌ Suppression non authentifiée
def test_delete_parser_unauthenticated(parser_elmt, client):
    response = client.delete(f"/parsers/{parser_elmt.id}")
    assert response.status_code == 401
