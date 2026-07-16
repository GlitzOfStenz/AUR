import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pytest_asyncio
from fastapi.testclient import TestClient

from main import app
from database.models import University


def get_client():
    return TestClient(app)


def unique_email():
    return f"user_{uuid.uuid4().hex[:8]}@example.com"


def register_and_login(client):
    payload = {
        "full_name": "Chandrika Test",
        "email": unique_email(),
        "password": "Password123!"
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 201, (
        f"Registration failed: "
        f"status={response.status_code}, "
        f"body={response.text}"
    )

    access_token = response.json()["access_token"]

    return {
        "Authorization": f"Bearer {access_token}"
    }


# ---------------------------------------------------
# TEST UNIVERSITY FIXTURE
# Creates a real DB university with a UUID.
# This avoids the Excel directory slug issue:
# "peking-university" is a slug, not a UUID.
# ---------------------------------------------------

@pytest_asyncio.fixture
async def test_university(db_session):
    university = University(
        id=uuid.uuid4(),
        slug=f"users-test-university-{uuid.uuid4().hex[:8]}",
        name="Users Test University",
        country="India",
        subregion="Southern Asia",
        size="L",
        focus="FC",
        research_level="VH",
        is_public=True,
    )

    db_session.add(university)
    await db_session.commit()
    await db_session.refresh(university)

    return university


# ---------------------------------------------------
# POST /users/bookmarks
# ---------------------------------------------------

def test_add_bookmark_success(test_university):
    with get_client() as client:
        headers = register_and_login(client)

        university_id = str(test_university.id)

        response = client.post(
            "/users/bookmarks",
            json={
                "university_id": university_id
            },
            headers=headers,
        )

        assert response.status_code == 201, (
            f"Expected 201, got {response.status_code}: {response.text}"
        )

        data = response.json()

        assert data["message"] == "Bookmark added"
        assert "bookmark_id" in data


def test_add_duplicate_bookmark(test_university):
    with get_client() as client:
        headers = register_and_login(client)

        university_id = str(test_university.id)

        first_response = client.post(
            "/users/bookmarks",
            json={
                "university_id": university_id
            },
            headers=headers,
        )

        assert first_response.status_code == 201, (
            f"First bookmark failed: "
            f"{first_response.status_code} {first_response.text}"
        )

        response = client.post(
            "/users/bookmarks",
            json={
                "university_id": university_id
            },
            headers=headers,
        )

        assert response.status_code == 409


def test_add_bookmark_unauthorized():
    with get_client() as client:
        response = client.post(
            "/users/bookmarks",
            json={
                "university_id": str(uuid.uuid4())
            },
        )

        assert response.status_code in (401, 403) 


def test_add_bookmark_invalid_uuid():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.post(
            "/users/bookmarks",
            json={
                "university_id": "invalid"
            },
            headers=headers,
        )

        assert response.status_code == 422


# ---------------------------------------------------
# GET /users/bookmarks
# ---------------------------------------------------

def test_get_bookmarks(test_university):
    with get_client() as client:
        headers = register_and_login(client)

        university_id = str(test_university.id)

        add_response = client.post(
            "/users/bookmarks",
            json={
                "university_id": university_id
            },
            headers=headers,
        )

        assert add_response.status_code == 201, (
            f"Bookmark setup failed: "
            f"{add_response.status_code} {add_response.text}"
        )

        response = client.get(
            "/users/bookmarks",
            headers=headers,
        )

        assert response.status_code == 200

        data = response.json()

        assert "bookmarks" in data
        assert "total" in data
        assert data["total"] >= 1


def test_get_bookmarks_empty():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.get(
            "/users/bookmarks",
            headers=headers,
        )

        assert response.status_code == 200

        data = response.json()

        assert "bookmarks" in data
        assert "total" in data
        assert data["total"] == 0


def test_get_bookmarks_unauthorized():
    with get_client() as client:
        response = client.get("/users/bookmarks")

        assert response.status_code in (401, 403)


# ---------------------------------------------------
# DELETE /users/bookmarks/{university_id}
# ---------------------------------------------------

def test_delete_bookmark_success(test_university):
    with get_client() as client:
        headers = register_and_login(client)

        university_id = str(test_university.id)

        add_response = client.post(
            "/users/bookmarks",
            json={
                "university_id": university_id
            },
            headers=headers,
        )

        assert add_response.status_code == 201, (
            f"Bookmark setup failed: "
            f"{add_response.status_code} {add_response.text}"
        )

        response = client.delete(
            f"/users/bookmarks/{university_id}",
            headers=headers,
        )

        assert response.status_code == 204


def test_delete_bookmark_not_found(test_university):
    with get_client() as client:
        headers = register_and_login(client)

        university_id = str(test_university.id)

        response = client.delete(
            f"/users/bookmarks/{university_id}",
            headers=headers,
        )

        assert response.status_code == 404


def test_delete_bookmark_invalid_uuid():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.delete(
            "/users/bookmarks/invalid",
            headers=headers,
        )

        assert response.status_code == 422


def test_delete_bookmark_unauthorized():
    with get_client() as client:
        response = client.delete(
            f"/users/bookmarks/{uuid.uuid4()}",
        )

        assert response.status_code in (401, 403)


# ---------------------------------------------------
# PATCH /users/preferences
# ---------------------------------------------------

def test_update_preferences():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.patch(
            "/users/preferences",
            json={
                "default_country": "India",
                "default_limit": 10,
                "preferred_metrics": ["overall_score"],
            },
            headers=headers,
        )

        assert response.status_code == 200, (
            f"Expected 200, got "
            f"{response.status_code}: {response.text}"
        )

        data = response.json()

        assert data["message"] == "Preferences updated"


def test_update_preferences_partial():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.patch(
            "/users/preferences",
            json={
                "default_country": "India"
            },
            headers=headers,
        )

        assert response.status_code == 200


def test_update_preferences_unauthorized():
    with get_client() as client:
        response = client.patch(
            "/users/preferences",
            json={
                "default_country": "India"
            },
        )

        assert response.status_code in (401, 403)


# ---------------------------------------------------
# GET /users/preferences
# ---------------------------------------------------

def test_get_preferences():
    with get_client() as client:
        headers = register_and_login(client)

        response = client.get(
            "/users/preferences",
            headers=headers,
        )

        assert response.status_code == 200

        data = response.json()

        assert isinstance(data, dict)


def test_get_preferences_unauthorized():
    with get_client() as client:
        response = client.get("/users/preferences")

        assert response.status_code in (401, 403)