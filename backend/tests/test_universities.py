import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_all_universities():
    response = client.get("/api/universities/")
    assert response.status_code == 200


def test_universities_response_structure():
    response = client.get("/api/universities/")
    data = response.json()

    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "data" in data
    assert isinstance(data["data"], list)


def test_university_schema():
    response = client.get("/api/universities/")
    data = response.json()["data"]

    assert len(data) > 0

    uni = data[0]

    required_fields = [
        "id",
        "name",
        "location",
        "subregion",
        "rank",
        "rank_2025",
        "history",
        "size",
        "focus",
        "research",
        "isPublic",
        "overall",
        "academicReputation",
        "employerReputation",
        "facultyStudentRatio",
        "citations",
        "intlStudents",
        "intlFaculty",
    ]

    for field in required_fields:
        assert field in uni


def test_pagination():
    response = client.get("/api/universities/?page=1&limit=5")

    assert response.status_code == 200

    data = response.json()

    assert len(data["data"]) <= 5
    assert data["page"] == 1
    assert data["limit"] == 5


def test_invalid_page():
    response = client.get("/api/universities/?page=0")
    assert response.status_code == 422


def test_invalid_limit():
    response = client.get("/api/universities/?limit=101")
    assert response.status_code == 422


def test_country_filter():
    response = client.get("/api/universities/?country=India")

    assert response.status_code == 200

    universities = response.json()["data"]

    for uni in universities:
        assert uni["location"].lower() == "india"


def test_non_existing_country_filter():
    response = client.get("/api/universities/?country=UnknownCountryXYZ")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert len(data["data"]) == 0


def test_public_filter():
    response = client.get("/api/universities/?status=public")

    assert response.status_code == 200

    universities = response.json()["data"]

    for uni in universities:
        assert uni["isPublic"] is True


def test_private_filter():
    response = client.get("/api/universities/?status=private")

    assert response.status_code == 200

    universities = response.json()["data"]

    for uni in universities:
        assert uni["isPublic"] is False


def test_valid_university():
    response = client.get("/api/universities/")

    first_id = response.json()["data"][0]["id"]

    response = client.get(f"/api/universities/{first_id}")

    assert response.status_code == 200

    university = response.json()

    assert university["id"] == first_id


def test_invalid_university():
    response = client.get("/api/universities/invalid-id")
    assert response.status_code == 404


def test_university_history_structure():
    response = client.get("/api/universities/")

    university = response.json()["data"][0]

    assert isinstance(university["history"], list)
    assert len(university["history"]) == 2


def test_combined_filters():
    response = client.get(
        "/api/universities/?country=India&status=public"
    )

    assert response.status_code == 200

    universities = response.json()["data"]

    for uni in universities:
        assert uni["location"].lower() == "india"
        assert uni["isPublic"] is True