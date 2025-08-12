"""
Destination Service for managing travel destinations
"""

import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.models.schemas import (
    DestinationSchema,
    DestinationSearchResponse,
    PaginatedResponse,
    DestinationCategory,
    PriceRange,
    LocationSchema
)
from app.models.database_models import Destination, Tag, Facility
from app.core.database import get_db

logger = logging.getLogger(__name__)


class DestinationService:
    """
    Service for managing destinations and related operations
    """

    def __init__(self, db: Session = None):
        self.db = db or next(get_db())

    def _destination_to_schema(self, destination: Destination) -> DestinationSchema:
        """Convert database model to Pydantic schema"""
        return DestinationSchema(
            id=str(destination.id),
            name=destination.name,
            description=destination.description or "",
            location=LocationSchema(
                latitude=destination.latitude,
                longitude=destination.longitude,
                address=destination.address or "",
                city=destination.city,
                province=destination.province
            ),
            category=DestinationCategory(destination.category),
            images=destination.images or [],
            rating=destination.rating,
            review_count=destination.review_count,
            price_range=PriceRange(destination.price_range),
            facilities=[facility.name for facility in destination.facilities],
            tags=[tag.name for tag in destination.tags],
            sentiment=None  # Will be populated separately if needed
        )
    
    async def search_destinations(
        self,
        query: Optional[str] = None,
        filters: Dict[str, Any] = None,
        page: int = 1,
        page_size: int = 20
    ) -> DestinationSearchResponse:
        """
        Search destinations with filters
        """
        try:
            # Build query
            db_query = self.db.query(Destination).filter(Destination.is_active == True)

            # Apply text search
            if query:
                search_filter = or_(
                    Destination.name.ilike(f"%{query}%"),
                    Destination.description.ilike(f"%{query}%"),
                    Destination.city.ilike(f"%{query}%"),
                    Destination.province.ilike(f"%{query}%")
                )
                db_query = db_query.filter(search_filter)

            # Apply filters
            if filters:
                if filters.get("category"):
                    db_query = db_query.filter(Destination.category == filters["category"])

                if filters.get("price_range"):
                    db_query = db_query.filter(Destination.price_range == filters["price_range"])

                if filters.get("city"):
                    db_query = db_query.filter(Destination.city.ilike(f"%{filters['city']}%"))

                if filters.get("province"):
                    db_query = db_query.filter(Destination.province.ilike(f"%{filters['province']}%"))

                if filters.get("min_rating"):
                    db_query = db_query.filter(Destination.rating >= filters["min_rating"])

            # Get total count
            total = db_query.count()

            # Apply pagination
            offset = (page - 1) * page_size
            destinations_db = db_query.offset(offset).limit(page_size).all()

            # Convert to schemas
            destinations = [self._destination_to_schema(dest) for dest in destinations_db]

            return DestinationSearchResponse(
                destinations=destinations,
                total=total,
                query=query or "",
                filters_applied=filters or {}
            )

        except Exception as e:
            logger.error(f"Error searching destinations: {str(e)}")
            raise
    
    async def get_destination(self, destination_id: str) -> Optional[DestinationSchema]:
        """
        Get a specific destination by ID
        """
        try:
            # Mock implementation - would query actual database
            return None
            
        except Exception as e:
            logger.error(f"Error getting destination: {str(e)}")
            raise
    
    async def list_destinations(self, page: int = 1, page_size: int = 20) -> PaginatedResponse:
        """
        List all destinations with pagination
        """
        try:
            # Mock implementation - would query actual database
            return PaginatedResponse(
                items=[],
                total=0,
                page=page,
                page_size=page_size,
                total_pages=0
            )
            
        except Exception as e:
            logger.error(f"Error listing destinations: {str(e)}")
            raise
    
    async def get_nearby_destinations(
        self,
        destination_id: str,
        radius_km: float = 50,
        limit: int = 10
    ) -> List[DestinationSchema]:
        """
        Find destinations near a specific destination
        """
        try:
            # Mock implementation - would use geospatial queries
            return []
            
        except Exception as e:
            logger.error(f"Error finding nearby destinations: {str(e)}")
            raise
