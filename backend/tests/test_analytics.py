import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_summary():
    response = client.get("/api/insights/summary")
    assert response.status_code == 200


def test_summary_structure():
    data = client.get("/api/insights/summary").json()

    assert "total_universities" in data
    assert isinstance(data["total_universities"], int)


def test_summary_count_positive():
    data = client.get("/api/insights/summary").json()

    assert data["total_universities"] >= 0


def test_by_country():
    response = client.get("/api/insights/by-country")

    assert response.status_code == 200


def test_by_country_structure():
    data = client.get("/api/insights/by-country").json()

    assert isinstance(data, list)

    if len(data) > 0:
        assert "country" in data[0]
        assert "count" in data[0]


def test_by_country_sorted():
    data = client.get("/api/insights/by-country").json()

    counts = [x["count"] for x in data]

    assert counts == sorted(counts, reverse=True)


def test_by_country_count_positive():
    data = client.get("/api/insights/by-country").json()

    for item in data:
        assert item["count"] > 0


def test_top_countries():
    response = client.get("/api/insights/countries/top")

    assert response.status_code == 200


def test_top_countries_default():
    data = client.get("/api/insights/countries/top").json()

    assert len(data) <= 10


def test_top_countries_limit_five():
    data = client.get("/api/insights/countries/top?limit=5").json()

    assert len(data) <= 5


def test_top_countries_limit_one():
    data = client.get("/api/insights/countries/top?limit=1").json()

    assert len(data) <= 1


def test_top_countries_large_limit():
    response = client.get("/api/insights/countries/top?limit=100")

    assert response.status_code == 200


def test_top_universities():
    response = client.get("/api/insights/top-universities")

    assert response.status_code == 200


def test_top_universities_structure():
    data = client.get("/api/insights/top-universities").json()

    assert isinstance(data, list)

    if len(data) > 0:
        uni = data[0]

        required = [
            "rank",
            "name",
            "country",
            "overall"
        ]

        for field in required:
            assert field in uni


def test_top_universities_limit():
    data = client.get("/api/insights/top-universities?limit=5").json()

    assert len(data) <= 5


def test_top_universities_sorted():
    data = client.get("/api/insights/top-universities").json()

    scores = []

    for uni in data:
        try:
            scores.append(float(uni["overall"]))
        except:
            scores.append(0)

    assert scores == sorted(scores, reverse=True)


def test_by_subregion():
    response = client.get("/api/insights/by-subregion")

    assert response.status_code == 200


def test_by_subregion_structure():
    data = client.get("/api/insights/by-subregion").json()

    assert isinstance(data, dict)


def test_subregion_counts():
    data = client.get("/api/insights/by-subregion").json()

    for value in data.values():
        assert isinstance(value, int)
        assert value >= 0


def test_country_average_score():
    response = client.get("/api/insights/country-average-score")

    assert response.status_code == 200


def test_country_average_structure():
    data = client.get("/api/insights/country-average-score").json()

    assert isinstance(data, list)

    if len(data) > 0:
        assert "country" in data[0]
        assert "average_score" in data[0]


def test_country_average_sorted():
    data = client.get("/api/insights/country-average-score").json()

    scores = [x["average_score"] for x in data]

    assert scores == sorted(scores, reverse=True)


def test_country_average_positive():
    data = client.get("/api/insights/country-average-score").json()

    for item in data:
        assert item["average_score"] >= 0