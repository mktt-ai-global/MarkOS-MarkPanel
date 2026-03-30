import pytest

@pytest.fixture
def auth_header(client):
    client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword", "email": "test@example.com"}
    )
    response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_list_files(client, auth_header):
    response = client.get("/api/files/list", headers=auth_header)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_mkdir_traversal_attempt(client, auth_header):
    response = client.post(
        "/api/files/mkdir",
        headers=auth_header,
        json={"path": "", "name": "../traversal_dir"}
    )
    # The current implementation of _safe_join will throw 400 for path traversal
    # but the path component of mkdir is handled first.
    # Let's see if the implementation catches it.
    assert response.status_code == 400
    assert "Access denied" in response.json()["detail"] or "Invalid path" in response.json()["detail"]
