"""
Pytest configuration and fixtures
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.config import settings
from main import app

# Test database URL (use in-memory SQLite for tests)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session")
def test_db():
    """Create test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(test_db):
    """Create a fresh database session for each test"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """Create test client with database override"""
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_destination_data():
    """Sample destination data for testing"""
    return {
        "name": "Test Destination",
        "description": "A test destination for unit testing",
        "category": "beach",
        "latitude": -8.7205,
        "longitude": 115.1693,
        "address": "Test Address",
        "city": "Test City",
        "province": "Test Province",
        "rating": 4.5,
        "review_count": 100,
        "price_range": "moderate",
        "entry_fee": 50000,
        "images": ["https://example.com/image1.jpg"],
        "slug": "test-destination",
        "is_active": True
    }


@pytest.fixture
def sample_travel_query():
    """Sample travel query for testing"""
    return {
        "query": "Saya ingin liburan 3 hari di Bali bersama keluarga, budget 5 juta",
        "destination": "Bali",
        "duration": 3,
        "budget": 5000000,
        "traveler_count": 4,
        "traveler_type": "family",
        "interests": ["pantai", "kuliner"]
    }


@pytest.fixture
def sample_itinerary_request():
    """Sample itinerary generation request"""
    return {
        "destination": "Bali",
        "duration": 3,
        "budget": 5000000,
        "traveler_count": 4,
        "traveler_type": "family",
        "interests": ["pantai", "kuliner"],
        "activity_level": "moderate"
    }
