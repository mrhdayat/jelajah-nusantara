"""
Service layer tests
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.services.ai_service import AIService
from app.services.destination_service import DestinationService
from app.services.itinerary_service import ItineraryService
from app.models.schemas import TravelerType, ActivityLevel


class TestAIService:
    """Test AI service functionality"""
    
    @pytest.fixture
    def ai_service(self):
        """Create AI service instance for testing"""
        return AIService()
    
    def test_ai_service_initialization(self, ai_service):
        """Test AI service initializes correctly"""
        assert ai_service is not None
        assert hasattr(ai_service, 'provider')
        assert hasattr(ai_service, 'ai_config')
    
    @pytest.mark.asyncio
    async def test_parse_travel_query_fallback(self, ai_service):
        """Test travel query parsing with fallback method"""
        query = "Saya ingin liburan 3 hari di Bali bersama keluarga, budget 5 juta"
        
        # Mock the AI provider to be 'none' to force fallback
        ai_service.provider = "none"
        
        result = await ai_service.parse_travel_query(query)
        
        assert result is not None
        assert hasattr(result, 'confidence')
        assert result.confidence >= 0
        assert result.confidence <= 1
    
    @pytest.mark.asyncio
    async def test_parse_travel_query_with_keywords(self, ai_service):
        """Test travel query parsing extracts keywords correctly"""
        query = "Liburan 5 hari di Jakarta dengan teman-teman, suka kuliner dan budaya"
        
        ai_service.provider = "none"  # Use fallback
        result = await ai_service.parse_travel_query(query)
        
        assert result.extracted_keywords is not None
        assert len(result.extracted_keywords) > 0
    
    def test_fallback_parse_query_bali(self, ai_service):
        """Test fallback parsing recognizes Bali"""
        query = "Saya ingin ke Bali 3 hari"
        result = ai_service._fallback_parse_query(query)
        
        assert result.destination == "Bali"
        assert result.duration == 3
    
    def test_fallback_parse_query_budget(self, ai_service):
        """Test fallback parsing extracts budget"""
        query = "Budget 2 juta untuk liburan"
        result = ai_service._fallback_parse_query(query)
        
        assert result.budget == 2000000
    
    def test_fallback_parse_query_traveler_type(self, ai_service):
        """Test fallback parsing identifies traveler type"""
        query = "Liburan bersama keluarga"
        result = ai_service._fallback_parse_query(query)
        
        assert result.traveler_type == TravelerType.FAMILY
    
    @pytest.mark.asyncio
    async def test_get_recommendations_fallback(self, ai_service):
        """Test getting recommendations with fallback"""
        from app.models.schemas import ParsedTravelQuery
        
        parsed_query = ParsedTravelQuery(
            destination="Bali",
            duration=3,
            budget=5000000,
            traveler_type=TravelerType.FAMILY,
            interests=["pantai", "kuliner"],
            confidence=0.8
        )
        
        ai_service.provider = "none"  # Use fallback
        result = await ai_service.get_recommendations(parsed_query)
        
        assert result is not None
        assert "recommendations" in result
    
    @pytest.mark.asyncio
    async def test_chat_fallback(self, ai_service):
        """Test chat functionality with fallback"""
        ai_service.provider = "none"  # Use fallback
        
        # Test greeting
        response = await ai_service.chat("Halo", {})
        assert "Halo" in response or "halo" in response.lower()
        
        # Test budget question
        response = await ai_service.chat("Berapa budget yang dibutuhkan?", {})
        assert "budget" in response.lower() or "biaya" in response.lower()


class TestDestinationService:
    """Test destination service functionality"""
    
    @pytest.fixture
    def destination_service(self, db_session):
        """Create destination service instance for testing"""
        return DestinationService(db=db_session)
    
    @pytest.mark.asyncio
    async def test_search_destinations_empty(self, destination_service):
        """Test searching destinations with empty database"""
        result = await destination_service.search_destinations()
        
        assert result is not None
        assert result.total == 0
        assert len(result.destinations) == 0
    
    @pytest.mark.asyncio
    async def test_search_destinations_with_query(self, destination_service):
        """Test searching destinations with query"""
        result = await destination_service.search_destinations(query="test")
        
        assert result is not None
        assert result.query == "test"
    
    @pytest.mark.asyncio
    async def test_search_destinations_with_filters(self, destination_service):
        """Test searching destinations with filters"""
        filters = {
            "category": "beach",
            "price_range": "moderate",
            "min_rating": 4.0
        }
        
        result = await destination_service.search_destinations(filters=filters)
        
        assert result is not None
        assert result.filters_applied == filters
    
    @pytest.mark.asyncio
    async def test_get_destination_not_found(self, destination_service):
        """Test getting non-existent destination"""
        result = await destination_service.get_destination("non-existent-id")
        assert result is None


class TestItineraryService:
    """Test itinerary service functionality"""
    
    @pytest.fixture
    def itinerary_service(self, db_session):
        """Create itinerary service instance for testing"""
        return ItineraryService()
    
    @pytest.mark.asyncio
    async def test_generate_itinerary(self, itinerary_service, sample_itinerary_request):
        """Test itinerary generation"""
        from app.models.schemas import ItineraryGenerationRequest, TravelerType, ActivityLevel
        
        request = ItineraryGenerationRequest(
            destination="Bali",
            duration=3,
            budget=5000000,
            traveler_count=4,
            traveler_type=TravelerType.FAMILY,
            interests=["pantai", "kuliner"],
            activity_level=ActivityLevel.MODERATE
        )
        
        result = await itinerary_service.generate_itinerary(request)
        
        assert result is not None
        assert result.itinerary is not None
        assert result.itinerary.total_duration == 3
        assert result.itinerary.traveler_count == 4
        assert result.itinerary.traveler_type == TravelerType.FAMILY
        assert len(result.itinerary.days) == 3
        assert result.confidence_score >= 0
        assert result.confidence_score <= 1
    
    @pytest.mark.asyncio
    async def test_create_mock_itinerary(self, itinerary_service, sample_itinerary_request):
        """Test mock itinerary creation"""
        from app.models.schemas import ItineraryGenerationRequest, TravelerType, ActivityLevel
        
        request = ItineraryGenerationRequest(
            destination="Jakarta",
            duration=2,
            budget=3000000,
            traveler_count=2,
            traveler_type=TravelerType.COUPLE,
            interests=["kuliner", "budaya"],
            activity_level=ActivityLevel.MODERATE
        )
        
        result = await itinerary_service._create_mock_itinerary(request)
        
        assert result is not None
        assert result.total_duration == 2
        assert result.traveler_count == 2
        assert result.traveler_type == TravelerType.COUPLE
        assert len(result.days) == 2
        
        # Check that each day has items
        for day in result.days:
            assert len(day.items) > 0
            assert day.total_cost > 0
    
    def test_create_mock_destinations_bali(self, itinerary_service):
        """Test mock destination creation for Bali"""
        destinations = itinerary_service._create_mock_destinations("Bali")
        
        assert len(destinations) > 0
        # Should have Bali-specific destinations
        destination_names = [dest.name for dest in destinations]
        assert any("Bali" in name or "Kuta" in name or "Ubud" in name or "Tanah Lot" in name 
                  for name in destination_names)
    
    def test_create_mock_destinations_generic(self, itinerary_service):
        """Test mock destination creation for generic location"""
        destinations = itinerary_service._create_mock_destinations("Unknown City")
        
        assert len(destinations) > 0
        # Should have at least one destination
        assert destinations[0].name is not None
        assert destinations[0].location is not None


class TestServiceIntegration:
    """Test service integration"""
    
    @pytest.mark.asyncio
    async def test_ai_to_itinerary_flow(self):
        """Test complete flow from AI parsing to itinerary generation"""
        ai_service = AIService()
        itinerary_service = ItineraryService()
        
        # Parse query
        query = "Liburan 2 hari di Jakarta bersama pasangan, budget 3 juta"
        parsed_query = await ai_service.parse_travel_query(query)
        
        assert parsed_query is not None
        
        # Generate itinerary from parsed query
        if parsed_query.destination and parsed_query.duration:
            from app.models.schemas import ItineraryGenerationRequest, TravelerType, ActivityLevel
            
            request = ItineraryGenerationRequest(
                destination=parsed_query.destination,
                duration=parsed_query.duration,
                budget=parsed_query.budget or 3000000,
                traveler_count=parsed_query.traveler_count or 2,
                traveler_type=parsed_query.traveler_type or TravelerType.COUPLE,
                interests=parsed_query.interests or [],
                activity_level=ActivityLevel.MODERATE
            )
            
            result = await itinerary_service.generate_itinerary(request)
            
            assert result is not None
            assert result.itinerary is not None
