"""
Itinerary Service for generating and managing travel itineraries
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import uuid

from app.models.schemas import (
    ItineraryGenerationRequest,
    ItineraryGenerationResponse,
    ItinerarySchema,
    ItineraryDaySchema,
    ItineraryItemSchema,
    DestinationSchema,
    LocationSchema,
    DestinationCategory,
    PriceRange
)
from app.services.ai_service import AIService
from app.services.destination_service import DestinationService

logger = logging.getLogger(__name__)


class ItineraryService:
    """
    Service for generating and managing travel itineraries
    """
    
    def __init__(self):
        self.ai_service = AIService()
        self.destination_service = DestinationService()
    
    async def generate_itinerary(
        self,
        request: ItineraryGenerationRequest
    ) -> ItineraryGenerationResponse:
        """
        Generate a complete travel itinerary based on user preferences
        """
        try:
            logger.info(f"Generating itinerary for {request.destination}, {request.duration} days")
            
            # Mock implementation - would use AI and real destination data
            itinerary = await self._create_mock_itinerary(request)
            
            return ItineraryGenerationResponse(
                itinerary=itinerary,
                ai_reasoning="Itinerary dibuat berdasarkan preferensi Anda dengan mempertimbangkan jarak, waktu, dan minat wisata.",
                confidence_score=0.85,
                alternative_suggestions=[
                    "Pertimbangkan untuk menambah 1 hari untuk eksplorasi lebih mendalam",
                    "Coba kunjungi pasar lokal untuk pengalaman kuliner yang autentik"
                ]
            )
            
        except Exception as e:
            logger.error(f"Error generating itinerary: {str(e)}")
            raise
    
    async def _create_mock_itinerary(
        self,
        request: ItineraryGenerationRequest
    ) -> ItinerarySchema:
        """
        Create a mock itinerary for demonstration
        """
        itinerary_id = str(uuid.uuid4())
        start_date = request.start_date or date.today()
        
        # Create mock destinations
        mock_destinations = self._create_mock_destinations(request.destination)
        
        # Create itinerary days
        days = []
        total_cost = 0
        
        for day_num in range(1, request.duration + 1):
            current_date = start_date + timedelta(days=day_num - 1)
            
            # Create items for this day (2-3 destinations per day)
            day_items = []
            day_cost = 0
            
            destinations_per_day = min(3, len(mock_destinations))
            for i in range(destinations_per_day):
                if i < len(mock_destinations):
                    destination = mock_destinations[i]
                    
                    # Calculate time slots
                    start_time = f"{9 + i * 3}:00"
                    end_time = f"{11 + i * 3}:00"
                    
                    item_cost = 100000 + (i * 50000)  # Mock cost
                    
                    item = ItineraryItemSchema(
                        id=str(uuid.uuid4()),
                        destination=destination,
                        start_time=start_time,
                        end_time=end_time,
                        duration=120,  # 2 hours
                        estimated_cost=item_cost,
                        notes=f"Kunjungan ke {destination.name}"
                    )
                    
                    day_items.append(item)
                    day_cost += item_cost
            
            day = ItineraryDaySchema(
                day=day_num,
                date=current_date,
                items=day_items,
                total_cost=day_cost,
                notes=f"Hari {day_num} - Eksplorasi {request.destination}"
            )
            
            days.append(day)
            total_cost += day_cost
        
        return ItinerarySchema(
            id=itinerary_id,
            title=f"Perjalanan {request.duration} Hari ke {request.destination}",
            description=f"Itinerary {request.duration} hari untuk {request.traveler_count} orang di {request.destination}",
            days=days,
            total_cost=total_cost,
            total_duration=request.duration,
            traveler_count=request.traveler_count,
            traveler_type=request.traveler_type,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    def _create_mock_destinations(self, destination_name: str) -> List[DestinationSchema]:
        """
        Create mock destinations for the itinerary
        """
        destinations = []
        
        # Mock destinations based on location
        if "bali" in destination_name.lower():
            mock_data = [
                {
                    "name": "Pantai Kuta",
                    "description": "Pantai terkenal dengan sunset yang indah",
                    "category": DestinationCategory.BEACH,
                    "city": "Badung",
                    "lat": -8.7205,
                    "lng": 115.1693
                },
                {
                    "name": "Pura Tanah Lot",
                    "description": "Pura Hindu yang ikonik di atas batu karang",
                    "category": DestinationCategory.RELIGIOUS,
                    "city": "Tabanan",
                    "lat": -8.6211,
                    "lng": 115.0868
                },
                {
                    "name": "Ubud Monkey Forest",
                    "description": "Hutan suci dengan monyet dan pura kuno",
                    "category": DestinationCategory.NATURE,
                    "city": "Ubud",
                    "lat": -8.5069,
                    "lng": 115.2581
                }
            ]
        else:
            # Generic mock destinations
            mock_data = [
                {
                    "name": f"Destinasi Utama {destination_name}",
                    "description": f"Tempat wisata populer di {destination_name}",
                    "category": DestinationCategory.CULTURAL,
                    "city": destination_name,
                    "lat": -6.2088,
                    "lng": 106.8456
                }
            ]
        
        for i, data in enumerate(mock_data):
            destination = DestinationSchema(
                id=str(uuid.uuid4()),
                name=data["name"],
                description=data["description"],
                location=LocationSchema(
                    latitude=data["lat"],
                    longitude=data["lng"],
                    address=f"Alamat {data['name']}",
                    city=data["city"],
                    province="Bali" if "bali" in destination_name.lower() else "Indonesia"
                ),
                category=data["category"],
                images=[f"https://example.com/image{i+1}.jpg"],
                rating=4.2 + (i * 0.2),
                review_count=150 + (i * 50),
                price_range=PriceRange.MODERATE,
                facilities=["Parkir", "Toilet", "Warung"],
                tags=["populer", "instagramable"]
            )
            destinations.append(destination)
        
        return destinations
    
    async def get_itinerary(self, itinerary_id: str) -> Optional[ItinerarySchema]:
        """
        Retrieve a specific itinerary by ID
        """
        try:
            # Mock implementation - would query database
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving itinerary: {str(e)}")
            raise
    
    async def update_itinerary(
        self,
        itinerary_id: str,
        updates: Dict[str, Any]
    ) -> Optional[ItinerarySchema]:
        """
        Update an existing itinerary
        """
        try:
            # Mock implementation - would update database
            return None
            
        except Exception as e:
            logger.error(f"Error updating itinerary: {str(e)}")
            raise
    
    async def delete_itinerary(self, itinerary_id: str) -> bool:
        """
        Delete an itinerary
        """
        try:
            # Mock implementation - would delete from database
            return False
            
        except Exception as e:
            logger.error(f"Error deleting itinerary: {str(e)}")
            raise
    
    async def update_destination_sentiments(self, destination_ids: List[str]):
        """
        Background task to update sentiment analysis for destinations
        """
        try:
            logger.info(f"Updating sentiment analysis for {len(destination_ids)} destinations")
            # This would run sentiment analysis in the background
            
        except Exception as e:
            logger.error(f"Error updating destination sentiments: {str(e)}")
