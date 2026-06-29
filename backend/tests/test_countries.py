import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_all_countries():
    response = client.get("/api/countries/")
    assert response.status_code == 200


def test_countries_response_is_list():
    response = client.get("/api/countries/")
    data = response.json()

    assert isinstance(data, list)


def test_countries_not_empty():
    response = client.get("/api/countries/")
    data = response.json()

    assert len(data) > 0


def test_country_schema():
    response = client.get("/api/countries/")
    country = response.json()[0]

    assert "country" in country
    assert "university_count" in country
    assert "subregion" in country


def test_country_fields_type():
    response = client.get("/api/countries/")
    country = response.json()[0]

    assert isinstance(country["country"], str)
    assert isinstance(country["university_count"], int)
    assert isinstance(country["subregion"], str)


def test_country_count_positive():
    response = client.get("/api/countries/")
    countries = response.json()

    for country in countries:
        assert country["university_count"] > 0


def test_countries_sorted_descending():
    response = client.get("/api/countries/")
    countries = response.json()

    counts = [c["university_count"] for c in countries]

    assert counts == sorted(counts, reverse=True)


def test_valid_country():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    assert response.status_code == 200


def test_country_response_structure():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    data = response.json()

    assert "country" in data
    assert "total" in data
    assert "data" in data


def test_country_name_echo():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    assert response.json()["country"] == country_name


def test_country_total_matches_data_length():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    data = response.json()

    assert data["total"] == len(data["data"])


def test_country_case_insensitive():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(
        f"/api/countries/{country_name.lower()}"
    )

    assert response.status_code == 200


def test_country_universities_match_country():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    universities = response.json()["data"]

    for uni in universities:
        assert uni["location"].lower() == country_name.lower()


def test_country_university_schema():
    response = client.get("/api/countries/")
    country_name = response.json()[0]["country"]

    response = client.get(f"/api/countries/{country_name}")

    university = response.json()["data"][0]

    assert "id" in university
    assert "name" in university
    assert "location" in university


def test_invalid_country():
    response = client.get(
        "/api/countries/UnknownCountryXYZ"
    )

    assert response.status_code == 404


def test_invalid_country_error_message():
    response = client.get(
        
        "/api/countries/UnknownCountryXYZ"
    )

    assert response.json()["detail"] == "Country not found"