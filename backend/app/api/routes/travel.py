"""
Travel planning API routes
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
import logging

from app.models.schemas import (
    TravelQueryRequest,
    ItineraryGenerationRequest,
    ItineraryGenerationResponse,
    ApiResponse,
    ParsedTravelQuery
)
from app.services.ai_service import AIService
from app.services.itinerary_service import ItineraryService
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency injection
def get_ai_service() -> AIService:
    return AIService()

def get_itinerary_service() -> ItineraryService:
    return ItineraryService()


@router.post("/query", response_model=ApiResponse)
async def process_travel_query(
    request: TravelQueryRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Process natural language travel query and extract structured information

    Example query: "Saya ingin liburan 3 hari di Bali bersama keluarga, 
    suka pantai yang tenang dan kuliner lokal, budget 5 juta"
    """
    try:
        logger.info(f"Processing travel query: {request.query[:100]}...")

        # Parse natural language query using AI
        parsed_query = await ai_service.parse_travel_query(request.query)

        # Merge with explicit parameters if provided
        if request.destination:
            parsed_query.destination = request.destination
        if request.duration:
            parsed_query.duration = request.duration
        if request.budget:
            parsed_query.budget = request.budget
        if request.traveler_count:
            parsed_query.traveler_count = request.traveler_count
        if request.traveler_type:
            parsed_query.traveler_type = request.traveler_type
        if request.interests:
            parsed_query.interests.extend(request.interests)
        if request.start_date:
            parsed_query.start_date = request.start_date

        return ApiResponse(
            success=True,
            message="Travel query processed successfully",
            data=parsed_query.dict()
        )

    except Exception as e:
        logger.error(f"Error processing travel query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process travel query: {str(e)}"
        )


@router.post("/generate-itinerary", response_model=ItineraryGenerationResponse)
async def generate_itinerary(
    request: ItineraryGenerationRequest,
    background_tasks: BackgroundTasks,
    ai_service: AIService = Depends(get_ai_service),
    itinerary_service: ItineraryService = Depends(get_itinerary_service)
):
    """
    Generate a complete travel itinerary based on user preferences
    """
    try:
        logger.info(f"Generating itinerary for {request.destination}, {request.duration} days")

        # Generate itinerary using AI and destination data
        itinerary_response = await itinerary_service.generate_itinerary(request)

        # Schedule background task for sentiment analysis
        background_tasks.add_task(
            itinerary_service.update_destination_sentiments,
            [item.destination.id for day in itinerary_response.itinerary.days for item in day.items]
        )

        return itinerary_response

    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate itinerary: {str(e)}"
        )


@router.get("/itinerary/{itinerary_id}")
async def get_itinerary(
    itinerary_id: str,
    itinerary_service: ItineraryService = Depends(get_itinerary_service)
):
    """
    Retrieve a specific itinerary by ID
    """
    try:
        itinerary = await itinerary_service.get_itinerary(itinerary_id)

        if not itinerary:
            raise HTTPException(
                status_code=404,
                detail="Itinerary not found"
            )

        return ApiResponse(
            success=True,
            data=itinerary.dict()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving itinerary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve itinerary: {str(e)}"
        )


@router.put("/itinerary/{itinerary_id}")
async def update_itinerary(
    itinerary_id: str,
    updates: dict,
    itinerary_service: ItineraryService = Depends(get_itinerary_service)
):
    """
    Update an existing itinerary
    """
    try:
        updated_itinerary = await itinerary_service.update_itinerary(itinerary_id, updates)

        if not updated_itinerary:
            raise HTTPException(
                status_code=404,
                detail="Itinerary not found"
            )

        return ApiResponse(
            success=True,
            message="Itinerary updated successfully",
            data=updated_itinerary.dict()
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating itinerary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update itinerary: {str(e)}"
        )


@router.delete("/itinerary/{itinerary_id}")
async def delete_itinerary(
    itinerary_id: str,
    itinerary_service: ItineraryService = Depends(get_itinerary_service)
):
    """
    Delete an itinerary
    """
    try:
        success = await itinerary_service.delete_itinerary(itinerary_id)

        if not success:
            raise HTTPException(
                status_code=404,
                detail="Itinerary not found"
            )

        return ApiResponse(
            success=True,
            message="Itinerary deleted successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting itinerary: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete itinerary: {str(e)}"
        )