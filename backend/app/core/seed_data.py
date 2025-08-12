"""
Seed data for initial database population
"""

import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.database_models import (
    Destination, Tag, Facility, destination_tags, destination_facilities
)


def create_sample_destinations(db: Session):
    """Create sample destinations for Indonesia"""
    
    # Create tags first
    tags_data = [
        {"name": "populer", "description": "Destinasi populer", "color": "#FF6B6B"},
        {"name": "instagramable", "description": "Cocok untuk foto", "color": "#4ECDC4"},
        {"name": "keluarga", "description": "Ramah keluarga", "color": "#45B7D1"},
        {"name": "romantis", "description": "Cocok untuk pasangan", "color": "#F7DC6F"},
        {"name": "petualangan", "description": "Aktivitas petualangan", "color": "#BB8FCE"},
        {"name": "budaya", "description": "Wisata budaya", "color": "#F8C471"},
        {"name": "alam", "description": "Wisata alam", "color": "#82E0AA"},
        {"name": "kuliner", "description": "Wisata kuliner", "color": "#F1948A"},
    ]
    
    tags = []
    for tag_data in tags_data:
        tag = Tag(**tag_data)
        db.add(tag)
        tags.append(tag)
    
    # Create facilities
    facilities_data = [
        {"name": "Parkir", "icon": "parking", "description": "Area parkir tersedia"},
        {"name": "Toilet", "icon": "restroom", "description": "Fasilitas toilet"},
        {"name": "Warung", "icon": "restaurant", "description": "Warung makan"},
        {"name": "WiFi", "icon": "wifi", "description": "Internet gratis"},
        {"name": "ATM", "icon": "atm", "description": "Mesin ATM"},
        {"name": "Mushola", "icon": "mosque", "description": "Tempat ibadah"},
        {"name": "Souvenir", "icon": "shop", "description": "Toko souvenir"},
        {"name": "Guide", "icon": "person", "description": "Pemandu wisata"},
    ]
    
    facilities = []
    for facility_data in facilities_data:
        facility = Facility(**facility_data)
        db.add(facility)
        facilities.append(facility)
    
    db.commit()  # Commit tags and facilities first
    
    # Create sample destinations
    destinations_data = [
        {
            "name": "Pantai Kuta",
            "description": "Pantai terkenal di Bali dengan sunset yang menakjubkan dan ombak yang cocok untuk surfing. Tempat yang sempurna untuk bersantai dan menikmati keindahan alam.",
            "category": "beach",
            "latitude": -8.7205,
            "longitude": 115.1693,
            "address": "Jl. Pantai Kuta, Kuta",
            "city": "Badung",
            "province": "Bali",
            "rating": 4.3,
            "review_count": 1250,
            "price_range": "budget",
            "entry_fee": 0,
            "images": [
                "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            ],
            "opening_hours": {
                "monday": [{"open": "00:00", "close": "23:59"}],
                "tuesday": [{"open": "00:00", "close": "23:59"}],
                "wednesday": [{"open": "00:00", "close": "23:59"}],
                "thursday": [{"open": "00:00", "close": "23:59"}],
                "friday": [{"open": "00:00", "close": "23:59"}],
                "saturday": [{"open": "00:00", "close": "23:59"}],
                "sunday": [{"open": "00:00", "close": "23:59"}]
            },
            "slug": "pantai-kuta-bali",
            "is_featured": True,
            "tag_names": ["populer", "instagramable", "keluarga"],
            "facility_names": ["Parkir", "Toilet", "Warung", "Souvenir"]
        },
        {
            "name": "Candi Borobudur",
            "description": "Candi Buddha terbesar di dunia dan situs warisan dunia UNESCO. Masterpiece arsitektur dan spiritual yang menakjubkan.",
            "category": "historical",
            "latitude": -7.6079,
            "longitude": 110.2038,
            "address": "Jl. Badrawati, Borobudur",
            "city": "Magelang",
            "province": "Jawa Tengah",
            "rating": 4.6,
            "review_count": 2100,
            "price_range": "moderate",
            "entry_fee": 50000,
            "images": [
                "https://images.unsplash.com/photo-1596422846543-75c6fc197f07",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
            ],
            "opening_hours": {
                "monday": [{"open": "06:00", "close": "17:00"}],
                "tuesday": [{"open": "06:00", "close": "17:00"}],
                "wednesday": [{"open": "06:00", "close": "17:00"}],
                "thursday": [{"open": "06:00", "close": "17:00"}],
                "friday": [{"open": "06:00", "close": "17:00"}],
                "saturday": [{"open": "06:00", "close": "17:00"}],
                "sunday": [{"open": "06:00", "close": "17:00"}]
            },
            "slug": "candi-borobudur-magelang",
            "is_featured": True,
            "tag_names": ["populer", "budaya", "instagramable"],
            "facility_names": ["Parkir", "Toilet", "Warung", "Guide", "Souvenir", "Mushola"]
        },
        {
            "name": "Kawah Ijen",
            "description": "Kawah vulkanik dengan fenomena blue fire yang langka dan danau asam terbesar di dunia. Pengalaman hiking yang menantang dengan pemandangan spektakuler.",
            "category": "mountain",
            "latitude": -8.0587,
            "longitude": 114.2421,
            "address": "Kawah Ijen, Licin",
            "city": "Banyuwangi",
            "province": "Jawa Timur",
            "rating": 4.5,
            "review_count": 890,
            "price_range": "moderate",
            "entry_fee": 30000,
            "images": [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            ],
            "opening_hours": {
                "monday": [{"open": "02:00", "close": "12:00"}],
                "tuesday": [{"open": "02:00", "close": "12:00"}],
                "wednesday": [{"open": "02:00", "close": "12:00"}],
                "thursday": [{"open": "02:00", "close": "12:00"}],
                "friday": [{"open": "02:00", "close": "12:00"}],
                "saturday": [{"open": "02:00", "close": "12:00"}],
                "sunday": [{"open": "02:00", "close": "12:00"}]
            },
            "slug": "kawah-ijen-banyuwangi",
            "is_featured": True,
            "tag_names": ["petualangan", "alam", "instagramable"],
            "facility_names": ["Parkir", "Toilet", "Guide"]
        },
        {
            "name": "Malioboro Street",
            "description": "Jalan legendaris di Yogyakarta dengan berbagai toko, kuliner khas, dan pertunjukan seni jalanan. Pusat wisata belanja dan kuliner.",
            "category": "urban",
            "latitude": -7.7956,
            "longitude": 110.3695,
            "address": "Jl. Malioboro, Yogyakarta",
            "city": "Yogyakarta",
            "province": "DI Yogyakarta",
            "rating": 4.2,
            "review_count": 1680,
            "price_range": "budget",
            "entry_fee": 0,
            "images": [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            ],
            "opening_hours": {
                "monday": [{"open": "00:00", "close": "23:59"}],
                "tuesday": [{"open": "00:00", "close": "23:59"}],
                "wednesday": [{"open": "00:00", "close": "23:59"}],
                "thursday": [{"open": "00:00", "close": "23:59"}],
                "friday": [{"open": "00:00", "close": "23:59"}],
                "saturday": [{"open": "00:00", "close": "23:59"}],
                "sunday": [{"open": "00:00", "close": "23:59"}]
            },
            "slug": "malioboro-street-yogyakarta",
            "is_featured": False,
            "tag_names": ["populer", "kuliner", "budaya", "keluarga"],
            "facility_names": ["Parkir", "Toilet", "Warung", "ATM", "Souvenir"]
        },
        {
            "name": "Danau Toba",
            "description": "Danau vulkanik terbesar di Indonesia dengan Pulau Samosir di tengahnya. Keindahan alam yang memukau dengan budaya Batak yang kaya.",
            "category": "nature",
            "latitude": 2.6845,
            "longitude": 98.8756,
            "address": "Danau Toba, Samosir",
            "city": "Samosir",
            "province": "Sumatera Utara",
            "rating": 4.4,
            "review_count": 756,
            "price_range": "moderate",
            "entry_fee": 0,
            "images": [
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
            ],
            "opening_hours": {
                "monday": [{"open": "00:00", "close": "23:59"}],
                "tuesday": [{"open": "00:00", "close": "23:59"}],
                "wednesday": [{"open": "00:00", "close": "23:59"}],
                "thursday": [{"open": "00:00", "close": "23:59"}],
                "friday": [{"open": "00:00", "close": "23:59"}],
                "saturday": [{"open": "00:00", "close": "23:59"}],
                "sunday": [{"open": "00:00", "close": "23:59"}]
            },
            "slug": "danau-toba-samosir",
            "is_featured": True,
            "tag_names": ["alam", "budaya", "romantis", "keluarga"],
            "facility_names": ["Parkir", "Toilet", "Warung", "Souvenir"]
        }
    ]
    
    # Create destinations with relationships
    for dest_data in destinations_data:
        # Extract relationship data
        tag_names = dest_data.pop("tag_names", [])
        facility_names = dest_data.pop("facility_names", [])
        
        # Create destination
        destination = Destination(**dest_data)
        db.add(destination)
        db.flush()  # Get the ID
        
        # Add tags
        for tag_name in tag_names:
            tag = next((t for t in tags if t.name == tag_name), None)
            if tag:
                destination.tags.append(tag)
        
        # Add facilities
        for facility_name in facility_names:
            facility = next((f for f in facilities if f.name == facility_name), None)
            if facility:
                destination.facilities.append(facility)
    
    db.commit()
    print(f"Created {len(destinations_data)} sample destinations with tags and facilities")


def seed_database(db: Session):
    """Seed the database with initial data"""
    try:
        # Check if data already exists
        existing_destinations = db.query(Destination).count()
        if existing_destinations > 0:
            print("Database already contains destinations, skipping seed")
            return
        
        print("Seeding database with sample data...")
        create_sample_destinations(db)
        print("Database seeding completed successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
        raise
