"""
AI-powered features API routes
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import logging

from app.models.schemas import (
    TravelQueryRequest,
    ParsedTravelQuery,
    ApiResponse
)
from app.services.ai_service import AIService
from app.core.config import get_ai_config

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency injection
def get_ai_service() -> AIService:
    return AIService()


@router.post("/parse-query", response_model=ApiResponse)
async def parse_travel_query(
    request: TravelQueryRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Parse natural language travel query into structured data
    
    This endpoint uses AI to understand user intent and extract:
    - Destination preferences
    - Duration and dates
    - Budget constraints
    - Traveler information
    - Interests and activities
    """
    try:
        logger.info(f"Parsing query: {request.query[:100]}...")
        
        parsed_query = await ai_service.parse_travel_query(request.query)
        
        return ApiResponse(
            success=True,
            message="Query parsed successfully",
            data=parsed_query.dict()
        )
        
    except Exception as e:
        logger.error(f"Error parsing query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse travel query: {str(e)}"
        )


@router.post("/recommendations", response_model=ApiResponse)
async def get_ai_recommendations(
    parsed_query: ParsedTravelQuery,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Get AI-powered destination and activity recommendations
    """
    try:
        recommendations = await ai_service.get_recommendations(parsed_query)
        
        return ApiResponse(
            success=True,
            message="Recommendations generated successfully",
            data=recommendations
        )
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@router.post("/optimize-route", response_model=ApiResponse)
async def optimize_travel_route(
    destinations: List[str],
    start_location: str,
    preferences: Dict[str, Any],
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Optimize travel route using AI algorithms
    """
    try:
        optimized_route = await ai_service.optimize_route(
            destinations=destinations,
            start_location=start_location,
            preferences=preferences
        )
        
        return ApiResponse(
            success=True,
            message="Route optimized successfully",
            data=optimized_route
        )
        
    except Exception as e:
        logger.error(f"Error optimizing route: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to optimize route: {str(e)}"
        )


@router.get("/model-status", response_model=ApiResponse)
async def get_model_status():
    """
    Get current AI model status and configuration
    """
    try:
        ai_config = get_ai_config()
        
        status = {
            "provider": ai_config.get("provider", "none"),
            "model": ai_config.get("model", "none"),
            "available": ai_config.get("provider") != "none",
            "capabilities": []
        }
        
        if ai_config.get("provider") == "ibm_watsonx":
            status["capabilities"] = [
                "natural_language_processing",
                "query_parsing",
                "recommendation_generation",
                "route_optimization"
            ]
        elif ai_config.get("provider") == "openai":
            status["capabilities"] = [
                "natural_language_processing",
                "query_parsing",
                "recommendation_generation"
            ]
        elif ai_config.get("provider") == "huggingface":
            status["capabilities"] = [
                "natural_language_processing",
                "query_parsing"
            ]
        
        return ApiResponse(
            success=True,
            message="Model status retrieved successfully",
            data=status
        )
        
    except Exception as e:
        logger.error(f"Error getting model status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model status: {str(e)}"
        )


@router.post("/chat", response_model=ApiResponse)
async def chat_with_ai(
    message: str,
    context: Dict[str, Any] = None,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Chat with AI assistant for travel planning help
    """
    try:
        response = await ai_service.chat(
            message=message,
            context=context or {}
        )
        
        return ApiResponse(
            success=True,
            message="Chat response generated",
            data={
                "response": response,
                "context": context
            }
        )
        
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat message: {str(e)}"
        )
