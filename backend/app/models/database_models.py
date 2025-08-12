"""
SQLAlchemy database models
"""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, JSON,
    ForeignKey, Table, Index, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from app.core.database import Base


# Association table for many-to-many relationship between destinations and tags
destination_tags = Table(
    'destination_tags',
    Base.metadata,
    Column('destination_id', UUID(as_uuid=True), ForeignKey('destinations.id'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'), primary_key=True)
)

# Association table for many-to-many relationship between destinations and facilities
destination_facilities = Table(
    'destination_facilities',
    Base.metadata,
    Column('destination_id', UUID(as_uuid=True), ForeignKey('destinations.id'), primary_key=True),
    Column('facility_id', UUID(as_uuid=True), ForeignKey('facilities.id'), primary_key=True)
)


class User(Base):
    """User model for authentication and preferences"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    preferences = Column(JSON, nullable=True)  # Store user travel preferences
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    itineraries = relationship("Itinerary", back_populates="user")
    reviews = relationship("Review", back_populates="user")


class Destination(Base):
    """Destination model for travel locations"""
    __tablename__ = "destinations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    
    # Location information
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=False, index=True)
    province = Column(String(100), nullable=False, index=True)
    country = Column(String(100), default="Indonesia")
    
    # Ratings and reviews
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    # Pricing
    price_range = Column(String(20), nullable=False)  # budget, moderate, expensive, luxury
    entry_fee = Column(Float, nullable=True)
    
    # Images and media
    images = Column(JSON, nullable=True)  # Array of image URLs
    
    # Operating information
    opening_hours = Column(JSON, nullable=True)  # Store opening hours as JSON
    
    # SEO and metadata
    slug = Column(String(255), unique=True, index=True)
    meta_description = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tags = relationship("Tag", secondary=destination_tags, back_populates="destinations")
    facilities = relationship("Facility", secondary=destination_facilities, back_populates="destinations")
    reviews = relationship("Review", back_populates="destination")
    itinerary_items = relationship("ItineraryItem", back_populates="destination")
    sentiment_analysis = relationship("SentimentAnalysis", back_populates="destination", uselist=False)
    
    # Indexes for geospatial queries
    __table_args__ = (
        Index('idx_destination_location', 'latitude', 'longitude'),
        Index('idx_destination_city_province', 'city', 'province'),
    )


class Tag(Base):
    """Tags for categorizing destinations"""
    __tablename__ = "tags"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    color = Column(String(7), nullable=True)  # Hex color code
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    destinations = relationship("Destination", secondary=destination_tags, back_populates="tags")


class Facility(Base):
    """Facilities available at destinations"""
    __tablename__ = "facilities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False, index=True)
    icon = Column(String(50), nullable=True)  # Icon name or class
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    destinations = relationship("Destination", secondary=destination_facilities, back_populates="facilities")


class Itinerary(Base):
    """Travel itinerary model"""
    __tablename__ = "itineraries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Trip details
    total_cost = Column(Float, default=0.0)
    total_duration = Column(Integer, nullable=False)  # in days
    traveler_count = Column(Integer, nullable=False)
    traveler_type = Column(String(20), nullable=False)
    
    # Dates
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    # Status
    is_public = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    status = Column(String(20), default="draft")  # draft, published, archived
    
    # AI metadata
    ai_generated = Column(Boolean, default=False)
    ai_confidence = Column(Float, nullable=True)
    ai_reasoning = Column(Text, nullable=True)
    
    # User relationship
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="itineraries")
    days = relationship("ItineraryDay", back_populates="itinerary", cascade="all, delete-orphan")


class ItineraryDay(Base):
    """Individual day in an itinerary"""
    __tablename__ = "itinerary_days"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    day_number = Column(Integer, nullable=False)
    date = Column(DateTime(timezone=True), nullable=True)
    total_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    
    # Foreign key
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id"), nullable=False)
    
    # Relationships
    itinerary = relationship("Itinerary", back_populates="days")
    items = relationship("ItineraryItem", back_populates="day", cascade="all, delete-orphan")
    
    # Unique constraint
    __table_args__ = (
        UniqueConstraint('itinerary_id', 'day_number', name='uq_itinerary_day'),
    )


class ItineraryItem(Base):
    """Individual item/activity in an itinerary day"""
    __tablename__ = "itinerary_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_time = Column(String(5), nullable=False)  # HH:MM format
    end_time = Column(String(5), nullable=False)    # HH:MM format
    duration = Column(Integer, nullable=False)      # in minutes
    estimated_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    
    # Transportation to next item
    transportation_type = Column(String(20), nullable=True)
    transportation_duration = Column(Integer, nullable=True)  # in minutes
    transportation_cost = Column(Float, nullable=True)
    transportation_notes = Column(Text, nullable=True)
    
    # Foreign keys
    day_id = Column(UUID(as_uuid=True), ForeignKey("itinerary_days.id"), nullable=False)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"), nullable=False)
    
    # Relationships
    day = relationship("ItineraryDay", back_populates="items")
    destination = relationship("Destination", back_populates="itinerary_items")


class Review(Base):
    """User reviews for destinations"""
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    
    # Review metadata
    visit_date = Column(DateTime(timezone=True), nullable=True)
    is_verified = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    
    # Foreign keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    destination = relationship("Destination", back_populates="reviews")
    
    # Unique constraint - one review per user per destination
    __table_args__ = (
        UniqueConstraint('user_id', 'destination_id', name='uq_user_destination_review'),
    )


class SentimentAnalysis(Base):
    """Sentiment analysis results for destinations"""
    __tablename__ = "sentiment_analysis"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    overall_sentiment = Column(Float, nullable=False)  # -1 to 1
    positive_score = Column(Float, nullable=False)     # 0 to 1
    negative_score = Column(Float, nullable=False)     # 0 to 1
    neutral_score = Column(Float, nullable=False)      # 0 to 1
    
    # Analysis metadata
    keywords = Column(JSON, nullable=True)  # Array of keywords
    themes = Column(JSON, nullable=True)    # Positive/negative themes
    confidence = Column(Float, nullable=False)
    source_count = Column(Integer, default=0)  # Number of reviews analyzed
    
    # Foreign key
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    destination = relationship("Destination", back_populates="sentiment_analysis")
