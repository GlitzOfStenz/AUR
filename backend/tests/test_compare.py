import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_compare_valid():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    assert response.status_code == 200

    data = response.json()

    assert "count" in data
    assert "universities" in data


def test_compare_count_matches():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    data = response.json()

    assert data["count"] == len(data["universities"])


def test_compare_returns_two():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    assert response.json()["count"] == 2


def test_compare_schema():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    university = response.json()["universities"][0]

    required_fields = [
        "id",
        "name",
        "location",
        "rank",
        "overall"
    ]

    for field in required_fields:
        assert field in university


def test_compare_single_id():
    response = client.get(
        "/api/compare/?ids=peking-university"
    )

    assert response.status_code == 400


def test_compare_more_than_five():
    response = client.get(
        "/api/compare/?ids=a,b,c,d,e,f"
    )

    assert response.status_code == 400


def test_compare_missing_ids():
    response = client.get("/api/compare/")

    assert response.status_code == 422


def test_compare_invalid_ids():
    response = client.get(
        "/api/compare/?ids=abc123,xyz456"
    )

    assert response.status_code == 404


def test_compare_one_invalid_one_valid():
    response = client.get(
        "/api/compare/?ids=peking-university,abc123"
    )

    assert response.status_code == 404


def test_compare_whitespace():
    response = client.get(
        "/api/compare/?ids=peking-university, nanyang-technological-university-singapore-ntu-sin"
    )

    assert response.status_code == 200


def test_compare_duplicate_ids():
    response = client.get(
        "/api/compare/?ids=peking-university,peking-university"
    )

    assert response.status_code == 200

    assert response.json()["count"] == 2


def test_compare_university_type():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    data = response.json()

    assert isinstance(data["universities"], list)


def test_compare_count_type():
    response = client.get(
        "/api/compare/?ids=peking-university,nanyang-technological-university-singapore-ntu-sin"
    )

    assert isinstance(response.json()["count"], int)

def test_compare_exactly_five():
    response = client.get(
        "/api/compare/?ids=peking-university,"
        "nanyang-technological-university-singapore-ntu-sin,"
        "national-university-of-singapore-nus,"
        "fudan-university,"
        "the-hong-kong-university-of-science-and-technology"
    )

    assert response.status_code == 200
    assert response.json()["count"] == 5

def test_compare_error_message_single():
    response = client.get("/api/compare/?ids=peking-university")

    assert response.status_code == 400
    assert response.json()["detail"] == "Please provide at least 2 university IDs"

def test_compare_error_message_max():
    response = client.get("/api/compare/?ids=a,b,c,d,e,f")

    assert response.status_code == 400
    assert response.json()["detail"] == "Maximum 5 universities can be compared at once"

def test_compare_not_found_message():
    response = client.get("/api/compare/?ids=abc,xyz")

    assert response.status_code == 404
    assert "Universities not found" in response.json()["detail"]