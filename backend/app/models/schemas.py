"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class DestinationCategory(str, Enum):
    BEACH = "beach"
    MOUNTAIN = "mountain"
    CULTURAL = "cultural"
    HISTORICAL = "historical"
    CULINARY = "culinary"
    ADVENTURE = "adventure"
    RELIGIOUS = "religious"
    SHOPPING = "shopping"
    NIGHTLIFE = "nightlife"
    NATURE = "nature"
    URBAN = "urban"


class TravelerType(str, Enum):
    SOLO = "solo"
    COUPLE = "couple"
    FAMILY = "family"
    FRIENDS = "friends"
    BUSINESS = "business"


class PriceRange(str, Enum):
    BUDGET = "budget"
    MODERATE = "moderate"
    EXPENSIVE = "expensive"
    LUXURY = "luxury"


class ActivityLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


class TransportationType(str, Enum):
    FLIGHT = "flight"
    TRAIN = "train"
    BUS = "bus"
    CAR = "car"
    MOTORCYCLE = "motorcycle"
    BOAT = "boat"
    WALKING = "walking"


# Base schemas
class LocationSchema(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str
    city: str
    province: str


class SentimentAnalysisSchema(BaseModel):
    overall: float = Field(..., ge=-1, le=1)
    positive: float = Field(..., ge=0, le=1)
    negative: float = Field(..., ge=0, le=1)
    neutral: float = Field(..., ge=0, le=1)
    keywords: List[str] = []
    last_updated: datetime


class DestinationSchema(BaseModel):
    id: str
    name: str
    description: str
    location: LocationSchema
    category: DestinationCategory
    images: List[str] = []
    rating: float = Field(..., ge=0, le=5)
    review_count: int = Field(..., ge=0)
    price_range: PriceRange
    facilities: List[str] = []
    tags: List[str] = []
    sentiment: Optional[SentimentAnalysisSchema] = None


class TransportationSchema(BaseModel):
    type: TransportationType
    duration: int = Field(..., gt=0)  # in minutes
    cost: float = Field(..., ge=0)
    description: str


class ItineraryItemSchema(BaseModel):
    id: str
    destination: DestinationSchema
    start_time: str  # HH:MM format
    end_time: str    # HH:MM format
    duration: int = Field(..., gt=0)  # in minutes
    notes: Optional[str] = None
    estimated_cost: float = Field(..., ge=0)
    transportation_to_next: Optional[TransportationSchema] = None


class ItineraryDaySchema(BaseModel):
    day: int = Field(..., gt=0)
    date: date
    items: List[ItineraryItemSchema] = []
    total_cost: float = Field(..., ge=0)
    notes: Optional[str] = None


class ItinerarySchema(BaseModel):
    id: str
    title: str
    description: str
    days: List[ItineraryDaySchema] = []
    total_cost: float = Field(..., ge=0)
    total_duration: int = Field(..., gt=0)  # in days
    traveler_count: int = Field(..., gt=0)
    traveler_type: TravelerType
    created_at: datetime
    updated_at: datetime


# Request schemas
class TravelQueryRequest(BaseModel):
    query: str = Field(..., min_length=10, max_length=1000)
    destination: Optional[str] = None
    duration: Optional[int] = Field(None, gt=0, le=30)
    budget: Optional[float] = Field(None, gt=0)
    traveler_count: Optional[int] = Field(None, gt=0, le=20)
    traveler_type: Optional[TravelerType] = None
    interests: List[str] = []
    start_date: Optional[date] = None
    
    @validator('interests')
    def validate_interests(cls, v):
        if len(v) > 10:
            raise ValueError('Maximum 10 interests allowed')
        return v


class ItineraryGenerationRequest(BaseModel):
    destination: str
    duration: int = Field(..., gt=0, le=30)
    budget: float = Field(..., gt=0)
    traveler_count: int = Field(..., gt=0, le=20)
    traveler_type: TravelerType
    interests: List[str] = []
    activity_level: ActivityLevel = ActivityLevel.MODERATE
    start_date: Optional[date] = None


class SentimentAnalysisRequest(BaseModel):
    destination_id: str
    force_refresh: bool = False


# Response schemas
class ApiResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int = Field(..., ge=0)
    page: int = Field(..., gt=0)
    page_size: int = Field(..., gt=0)
    total_pages: int = Field(..., ge=0)


class DestinationSearchResponse(BaseModel):
    destinations: List[DestinationSchema]
    total: int
    query: str
    filters_applied: Dict[str, Any] = {}


class ItineraryGenerationResponse(BaseModel):
    itinerary: ItinerarySchema
    ai_reasoning: str
    confidence_score: float = Field(..., ge=0, le=1)
    alternative_suggestions: List[str] = []


class HealthCheckResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    version: str = "1.0.0"
    dependencies: Dict[str, str] = {}


# AI Processing schemas
class ParsedTravelQuery(BaseModel):
    destination: Optional[str] = None
    duration: Optional[int] = None
    budget: Optional[float] = None
    traveler_count: Optional[int] = None
    traveler_type: Optional[TravelerType] = None
    interests: List[str] = []
    activity_level: Optional[ActivityLevel] = None
    start_date: Optional[date] = None
    extracted_keywords: List[str] = []
    confidence: float = Field(..., ge=0, le=1)
