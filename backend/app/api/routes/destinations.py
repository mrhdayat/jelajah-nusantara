"""
Destinations API routes
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import logging

from app.models.schemas import (
    DestinationSchema,
    DestinationSearchResponse,
    SentimentAnalysisRequest,
    ApiResponse,
    PaginatedResponse,
    DestinationCategory,
    PriceRange
)
from app.services.destination_service import DestinationService
from app.services.sentiment_service import SentimentService

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency injection
def get_destination_service() -> DestinationService:
    return DestinationService()

def get_sentiment_service() -> SentimentService:
    return SentimentService()


@router.get("/search", response_model=DestinationSearchResponse)
async def search_destinations(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[DestinationCategory] = Query(None, description="Filter by category"),
    price_range: Optional[PriceRange] = Query(None, description="Filter by price range"),
    city: Optional[str] = Query(None, description="Filter by city"),
    province: Optional[str] = Query(None, description="Filter by province"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    destination_service: DestinationService = Depends(get_destination_service)
):
    """
    Search destinations with various filters
    """
    try:
        filters = {
            "category": category,
            "price_range": price_range,
            "city": city,
            "province": province,
            "min_rating": min_rating
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}
        
        result = await destination_service.search_destinations(
            query=q,
            filters=filters,
            page=page,
            page_size=page_size
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error searching destinations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search destinations: {str(e)}"
        )


@router.get("/{destination_id}", response_model=ApiResponse)
async def get_destination(
    destination_id: str,
    destination_service: DestinationService = Depends(get_destination_service)
):
    """
    Get detailed information about a specific destination
    """
    try:
        destination = await destination_service.get_destination(destination_id)
        
        if not destination:
            raise HTTPException(
                status_code=404,
                detail="Destination not found"
            )
        
        return ApiResponse(
            success=True,
            data=destination.dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving destination: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve destination: {str(e)}"
        )


@router.get("/", response_model=PaginatedResponse)
async def list_destinations(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    destination_service: DestinationService = Depends(get_destination_service)
):
    """
    List all destinations with pagination
    """
    try:
        result = await destination_service.list_destinations(page=page, page_size=page_size)
        return result
        
    except Exception as e:
        logger.error(f"Error listing destinations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list destinations: {str(e)}"
        )


@router.post("/sentiment-analysis", response_model=ApiResponse)
async def analyze_destination_sentiment(
    request: SentimentAnalysisRequest,
    sentiment_service: SentimentService = Depends(get_sentiment_service)
):
    """
    Analyze sentiment for a destination based on reviews
    """
    try:
        sentiment_analysis = await sentiment_service.analyze_destination_sentiment(
            destination_id=request.destination_id,
            force_refresh=request.force_refresh
        )
        
        return ApiResponse(
            success=True,
            message="Sentiment analysis completed",
            data=sentiment_analysis.dict()
        )
        
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze sentiment: {str(e)}"
        )


@router.get("/categories/list")
async def list_categories():
    """
    Get list of available destination categories
    """
    return ApiResponse(
        success=True,
        data=[category.value for category in DestinationCategory]
    )


@router.get("/nearby/{destination_id}")
async def get_nearby_destinations(
    destination_id: str,
    radius_km: float = Query(50, ge=1, le=200, description="Search radius in kilometers"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    destination_service: DestinationService = Depends(get_destination_service)
):
    """
    Find destinations near a specific destination
    """
    try:
        nearby_destinations = await destination_service.get_nearby_destinations(
            destination_id=destination_id,
            radius_km=radius_km,
            limit=limit
        )
        
        return ApiResponse(
            success=True,
            data=nearby_destinations
        )
        
    except Exception as e:
        logger.error(f"Error finding nearby destinations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to find nearby destinations: {str(e)}"
        )
