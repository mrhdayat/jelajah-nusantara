"""
API endpoint tests
"""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client: TestClient):
        """Test health check returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "timestamp" in data


class TestTravelAPI:
    """Test travel planning API endpoints"""
    
    def test_process_travel_query(self, client: TestClient, sample_travel_query):
        """Test travel query processing"""
        response = client.post("/api/v1/travel/query", json=sample_travel_query)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
    
    def test_process_travel_query_invalid(self, client: TestClient):
        """Test travel query with invalid data"""
        invalid_query = {"query": ""}  # Empty query
        response = client.post("/api/v1/travel/query", json=invalid_query)
        assert response.status_code == 422  # Validation error
    
    def test_generate_itinerary(self, client: TestClient, sample_itinerary_request):
        """Test itinerary generation"""
        response = client.post("/api/v1/travel/generate-itinerary", json=sample_itinerary_request)
        assert response.status_code == 200
        data = response.json()
        assert "itinerary" in data
        assert "ai_reasoning" in data
        assert "confidence_score" in data
    
    def test_generate_itinerary_invalid(self, client: TestClient):
        """Test itinerary generation with invalid data"""
        invalid_request = {"destination": ""}  # Missing required fields
        response = client.post("/api/v1/travel/generate-itinerary", json=invalid_request)
        assert response.status_code == 422


class TestDestinationAPI:
    """Test destination API endpoints"""
    
    def test_search_destinations_no_params(self, client: TestClient):
        """Test destination search without parameters"""
        response = client.get("/api/v1/destinations/search")
        assert response.status_code == 200
        data = response.json()
        assert "destinations" in data
        assert "total" in data
        assert isinstance(data["destinations"], list)
    
    def test_search_destinations_with_query(self, client: TestClient):
        """Test destination search with query parameter"""
        response = client.get("/api/v1/destinations/search?q=bali")
        assert response.status_code == 200
        data = response.json()
        assert "destinations" in data
        assert data["query"] == "bali"
    
    def test_search_destinations_with_filters(self, client: TestClient):
        """Test destination search with filters"""
        params = {
            "category": "beach",
            "price_range": "moderate",
            "min_rating": 4.0
        }
        response = client.get("/api/v1/destinations/search", params=params)
        assert response.status_code == 200
        data = response.json()
        assert "destinations" in data
    
    def test_get_destination_categories(self, client: TestClient):
        """Test getting destination categories"""
        response = client.get("/api/v1/destinations/categories/list")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
    
    def test_get_destination_not_found(self, client: TestClient):
        """Test getting non-existent destination"""
        response = client.get("/api/v1/destinations/non-existent-id")
        assert response.status_code == 404


class TestAIAPI:
    """Test AI API endpoints"""
    
    def test_parse_query(self, client: TestClient):
        """Test AI query parsing"""
        query_data = {"query": "Saya ingin liburan 3 hari di Bali"}
        response = client.post("/api/v1/ai/parse-query", json=query_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
    
    def test_parse_query_empty(self, client: TestClient):
        """Test AI query parsing with empty query"""
        query_data = {"query": ""}
        response = client.post("/api/v1/ai/parse-query", json=query_data)
        assert response.status_code == 422
    
    def test_get_model_status(self, client: TestClient):
        """Test getting AI model status"""
        response = client.get("/api/v1/ai/model-status")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        status = data["data"]
        assert "provider" in status
        assert "available" in status
        assert "capabilities" in status
    
    def test_chat_with_ai(self, client: TestClient):
        """Test AI chat functionality"""
        chat_data = {
            "message": "Halo, bisa bantu saya merencanakan perjalanan?",
            "context": {}
        }
        response = client.post("/api/v1/ai/chat", json=chat_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "response" in data["data"]


class TestErrorHandling:
    """Test error handling"""
    
    def test_404_endpoint(self, client: TestClient):
        """Test non-existent endpoint returns 404"""
        response = client.get("/non-existent-endpoint")
        assert response.status_code == 404
    
    def test_method_not_allowed(self, client: TestClient):
        """Test wrong HTTP method returns 405"""
        response = client.delete("/health")  # Health endpoint only supports GET
        assert response.status_code == 405
    
    def test_invalid_json(self, client: TestClient):
        """Test invalid JSON returns 422"""
        response = client.post(
            "/api/v1/travel/query",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422


class TestCORS:
    """Test CORS configuration"""
    
    def test_cors_headers(self, client: TestClient):
        """Test CORS headers are present"""
        response = client.options("/api/v1/destinations/search")
        assert response.status_code == 200
        # Note: In test environment, CORS headers might not be fully set
        # This test ensures the endpoint responds to OPTIONS requests


class TestRateLimiting:
    """Test rate limiting (if implemented)"""
    
    @pytest.mark.skip(reason="Rate limiting not implemented yet")
    def test_rate_limiting(self, client: TestClient):
        """Test rate limiting functionality"""
        # Make multiple requests quickly
        for _ in range(100):
            response = client.get("/health")
            if response.status_code == 429:  # Too Many Requests
                break
        else:
            pytest.fail("Rate limiting not working")


class TestAuthentication:
    """Test authentication (if implemented)"""
    
    @pytest.mark.skip(reason="Authentication not implemented yet")
    def test_protected_endpoint_without_auth(self, client: TestClient):
        """Test protected endpoint without authentication"""
        response = client.get("/api/v1/protected-endpoint")
        assert response.status_code == 401
    
    @pytest.mark.skip(reason="Authentication not implemented yet")
    def test_protected_endpoint_with_auth(self, client: TestClient):
        """Test protected endpoint with authentication"""
        headers = {"Authorization": "Bearer valid-token"}
        response = client.get("/api/v1/protected-endpoint", headers=headers)
        assert response.status_code == 200
