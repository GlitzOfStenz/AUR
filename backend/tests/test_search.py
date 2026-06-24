import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_search_valid_query():
    response = client.get("/api/search/?q=india")

    assert response.status_code == 200


def test_search_response_structure():
    response = client.get("/api/search/?q=india")

    data = response.json()

    assert "query" in data
    assert "total" in data
    assert "data" in data

    assert isinstance(data["data"], list)
    assert isinstance(data["total"], int)


def test_search_schema():
    response = client.get("/api/search/?q=india")

    data = response.json()["data"]

    if len(data) > 0:
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
        ]

        for field in required_fields:
            assert field in uni


def test_search_limit():
    response = client.get("/api/search/?q=india&limit=5")

    assert response.status_code == 200

    data = response.json()

    assert len(data["data"]) <= 5


def test_search_limit_one():
    response = client.get("/api/search/?q=india&limit=1")

    assert response.status_code == 200

    data = response.json()

    assert len(data["data"]) <= 1


def test_search_limit_fifty():
    response = client.get("/api/search/?q=india&limit=50")

    assert response.status_code == 200


def test_search_invalid_limit():
    response = client.get("/api/search/?q=india&limit=51")

    assert response.status_code == 422


def test_search_empty_query():
    response = client.get("/api/search/")

    assert response.status_code == 422


def test_search_no_results():
    response = client.get("/api/search/?q=xyzabc123")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert len(data["data"]) == 0


def test_search_case_insensitive():
    lower = client.get("/api/search/?q=india")
    upper = client.get("/api/search/?q=INDIA")

    assert lower.status_code == 200
    assert upper.status_code == 200

    assert lower.json()["total"] == upper.json()["total"]


def test_search_returns_matching_results():
    response = client.get("/api/search/?q=india")

    assert response.status_code == 200

    results = response.json()["data"]

    for uni in results:
        assert (
            "india" in uni["name"].lower()
            or "india" in uni["location"].lower()
        )


def test_query_echo():
    response = client.get("/api/search/?q=india")

    assert response.status_code == 200

    data = response.json()

    assert data["query"] == "india"