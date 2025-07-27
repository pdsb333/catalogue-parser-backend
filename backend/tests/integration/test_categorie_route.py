def test_read_categorie_unauthenticated(client):
    response = client.get("/categories/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_categorie_authenticated(auth_client):
    client, _ = auth_client
    response = client.get("/categories/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_categorie_unauthenticated(client):
    payload = {
        "name": "one categorie"
    }
    response = client.post("/categories/", json=payload)
    assert response.status_code == 401

def test_create_categorie_authenticated(auth_client):
    client , user = auth_client
    payload = {
        "name": "one categorie"
    }
    response = client.post("/categories/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "one categorie"
    assert data["admin_id"] == user.id

def test_update_categorie_authenticated(categorie_elmt, auth_client):
    client, user = auth_client
    payload={
        "name": "categorie avec des tests" #nouveau nom pour "categorie_test" dans conftest
    }
    response = client.patch(f'/categories/{categorie_elmt.id}', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "categorie avec des tests"
    assert data["admin_id"] == user.id

def test_update_categorie_unauthenticated(categorie_elmt, client):
    payload={
        "name": "categorie avec des tests" #nouveau nom pour "categorie_test" dans conftest
    }
    response = client.patch(f'/categories/{categorie_elmt.id}', json=payload)
    assert response.status_code in [400, 401]

def test_update_categorie_readonly_field(categorie_elmt, auth_client):
    client, user = auth_client
    payload = {
        "admin_id": 999
    }
    response = client.patch(f'/categories/{categorie_elmt.id}', json=payload)
    assert response.status_code in [200, 422, 400]
    data = response.json()
    assert data["admin_id"] == user.id

def test_delete_categorie_authenticated(categorie_elmt, auth_client):
    client, _ = auth_client
    response = client.delete(f'/categories/{categorie_elmt.id}')
    assert response.status_code == 200
    all_cats = client.get("/categories/").json()
    assert not any(cat["id"] == categorie_elmt.id for cat in all_cats)

def test_delete_categorie_unauthenticated(categorie_elmt, client):
    response = client.delete(f'/categories/{categorie_elmt.id}')
    assert response.status_code == 401