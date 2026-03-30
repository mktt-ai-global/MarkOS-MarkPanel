import pytest
from apps.api.core.security import get_password_hash

def test_login_no_user(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "nonexistent", "password": "password123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_register_and_login(client):
    # Register
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword", "email": "test@example.com"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
