import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app


def get_client():
    return TestClient(app)


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


def register_user(client, email=None, password="Password123"):
    if email is None:
        email = unique_email()

    payload = {
        "first_name": "Chandrika",
        "last_name": "Test",
        "email": email,
        "password": password
    }

    response = client.post("/auth/register", json=payload)
    return response, payload


# ------------------------
# REGISTER
# ------------------------

def test_register_success():
    with get_client() as client:
        response, _ = register_user(client)

        assert response.status_code == 201

        data = response.json()

        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"


def test_register_duplicate_email():
    with get_client() as client:
        email = unique_email()

        response, payload = register_user(client, email=email)
        assert response.status_code == 201

        duplicate = client.post("/auth/register", json=payload)

        assert duplicate.status_code == 409
        assert duplicate.json()["detail"] == "Email already registered"


def test_register_invalid_email():
    with get_client() as client:
        response = client.post(
            "/auth/register",
            json={
                "first_name": "Test",
                "last_name": "User",
                "email": "invalid-email",
                "password": "Password123"
            }
        )

        assert response.status_code == 422


def test_register_missing_password():
    with get_client() as client:
        response = client.post(
            "/auth/register",
            json={
                "first_name": "Test",
                "last_name": "User",
                "email": unique_email()
            }
        )

        assert response.status_code == 422


# ------------------------
# LOGIN
# ------------------------

def test_login_success():
    with get_client() as client:
        email = unique_email()
        password = "Password123"

        register_user(client, email=email, password=password)

        response = client.post(
            "/auth/login",
            json={
                "email": email,
                "password": password
            }
        )

        assert response.status_code == 200

        data = response.json()

        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"


def test_login_wrong_password():
    with get_client() as client:
        email = unique_email()

        register_user(client, email=email)

        response = client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "WrongPassword"
            }
        )

        assert response.status_code == 401


def test_login_unknown_email():
    with get_client() as client:
        response = client.post(
            "/auth/login",
            json={
                "email": unique_email(),
                "password": "Password123"
            }
        )

        assert response.status_code == 401


# ------------------------
# REFRESH TOKEN
# ------------------------

def test_refresh_success():
    with get_client() as client:
        response, _ = register_user(client)

        refresh_token = response.json()["refresh_token"]

        response = client.post(
            "/auth/refresh",
            json={
                "refresh_token": refresh_token
            }
        )

        assert response.status_code == 200

        data = response.json()

        assert "access_token" in data
        assert "refresh_token" in data


def test_refresh_invalid_token():
    with get_client() as client:
        response = client.post(
            "/auth/refresh",
            json={
                "refresh_token": "invalid-token"
            }
        )

        assert response.status_code == 401


# ------------------------
# LOGOUT
# ------------------------

def test_logout_success():
    with get_client() as client:
        response, _ = register_user(client)

        refresh_token = response.json()["refresh_token"]

        response = client.post(
            "/auth/logout",
            json={
                "refresh_token": refresh_token
            }
        )

        assert response.status_code == 204


def test_logout_invalid_token():
    with get_client() as client:
        response = client.post(
            "/auth/logout",
            json={
                "refresh_token": "invalid-token"
            }
        )

        assert response.status_code == 204