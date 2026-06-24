import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_rankings():
    response = client.get("/api/rankings/")
    assert response.status_code == 200


def test_rankings_response_structure():
    response = client.get("/api/rankings/")
    data = response.json()

    assert "metric" in data
    assert "total" in data
    assert "data" in data
    assert isinstance(data["data"], list)


def test_rankings_schema():
    response = client.get("/api/rankings/")
    data = response.json()["data"]

    assert len(data) > 0

    uni = data[0]

    required_fields = [
        "id",
        "name",
        "location",
        "rank",
        "overall"
    ]

    for field in required_fields:
        assert field in uni


def test_default_metric():
    response = client.get("/api/rankings/")

    assert response.status_code == 200
    assert response.json()["metric"] == "overall"


def test_top_limit():
    response = client.get("/api/rankings/?top=5")

    assert response.status_code == 200

    data = response.json()

    assert len(data["data"]) <= 5
    assert data["total"] <= 5


def test_invalid_top_zero():
    response = client.get("/api/rankings/?top=0")

    assert response.status_code == 422


def test_invalid_top_large():
    response = client.get("/api/rankings/?top=2000")

    assert response.status_code == 422


def test_country_filter():
    response = client.get("/api/rankings/?country=India")

    assert response.status_code == 200

    universities = response.json()["data"]

    for uni in universities:
        assert uni["location"].lower() == "india"


def test_invalid_country():
    response = client.get("/api/rankings/?country=UnknownCountryXYZ")

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert len(data["data"]) == 0


def test_metric_overall():
    response = client.get("/api/rankings/?metric=overall")

    assert response.status_code == 200
    assert response.json()["metric"] == "overall"


def test_metric_citations():
    response = client.get("/api/rankings/?metric=citations")

    assert response.status_code == 200
    assert response.json()["metric"] == "citations"


def test_metric_employability():
    response = client.get("/api/rankings/?metric=employability")

    assert response.status_code == 200
    assert response.json()["metric"] == "employability"


def test_invalid_metric_defaults_to_overall():
    response = client.get("/api/rankings/?metric=invalidMetric")

    assert response.status_code == 200
    assert response.json()["metric"] == "overall"


def test_combined_filter():
    response = client.get(
        "/api/rankings/?country=India&metric=overall&top=10"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["metric"] == "overall"

    for uni in data["data"]:
        assert uni["location"].lower() == "india"


def test_rankings_sorted_descending():
    response = client.get("/api/rankings/?metric=overall")

    data = response.json()["data"]

    scores = [
        u["overall"] if u["overall"] is not None else 0
        for u in data
    ]

    assert scores == sorted(scores, reverse=True)

def test_top_one():
    response = client.get("/api/rankings/?top=1")

    assert response.status_code == 200
    assert len(response.json()["data"]) == 1

def test_max_top_limit():
    response = client.get("/api/rankings/?top=1533")

    assert response.status_code == 200