"""Pytest fixtures: an isolated in-memory SQLite DB per test session, wired
into the FastAPI app via a get_db dependency override, so tests never touch
the real yatra_ai.db the dev server uses.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

# Import all models so their tables are registered on Base.metadata.
from app.models import trip, itinerary, profile  # noqa: F401

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def _fresh_test_schema():
    """Recreate all tables before every test so autoincrement ids (used to
    build item_id URLs in test_itinerary.py) are predictable, and so tests
    never see data left over from a previous test.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def sample_trip_payload():
    return {
        "destinationId": "hyderabad",
        "destinationName": "Hyderabad",
        "budgetMin": 1500,
        "budgetMax": 3000,
        "durationDays": 2,
        "durationNights": 1,
        "interests": ["history", "food", "photography"],
        "constraints": "Prefer less travel",
        "travelers": 2,
    }


@pytest.fixture()
def created_trip(client, sample_trip_payload):
    resp = client.post("/api/trips", json=sample_trip_payload)
    assert resp.status_code == 201
    return resp.json()
