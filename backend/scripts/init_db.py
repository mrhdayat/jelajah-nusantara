#!/usr/bin/env python3
"""
Database initialization script
"""

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import engine, get_db, create_tables, check_database_connection
from app.core.seed_data import seed_database
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize the database with tables and seed data"""
    try:
        logger.info("Starting database initialization...")
        
        # Check database connection
        if not check_database_connection():
            logger.error("Cannot connect to database. Please check your DATABASE_URL configuration.")
            return False
        
        # Create tables
        logger.info("Creating database tables...")
        create_tables()
        
        # Seed data
        logger.info("Seeding database with initial data...")
        db = next(get_db())
        try:
            seed_database(db)
        finally:
            db.close()
        
        logger.info("Database initialization completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        return False


def reset_database():
    """Reset the database (drop and recreate all tables)"""
    try:
        logger.warning("Resetting database - this will delete all data!")
        
        from app.core.database import drop_tables
        
        # Drop all tables
        logger.info("Dropping all tables...")
        drop_tables()
        
        # Recreate tables
        logger.info("Recreating tables...")
        create_tables()
        
        # Seed data
        logger.info("Seeding database...")
        db = next(get_db())
        try:
            seed_database(db)
        finally:
            db.close()
        
        logger.info("Database reset completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Database reset failed: {str(e)}")
        return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database management script")
    parser.add_argument(
        "--reset", 
        action="store_true", 
        help="Reset database (drop and recreate all tables)"
    )
    parser.add_argument(
        "--check", 
        action="store_true", 
        help="Check database connection only"
    )
    
    args = parser.parse_args()
    
    if args.check:
        if check_database_connection():
            print("✅ Database connection successful")
            sys.exit(0)
        else:
            print("❌ Database connection failed")
            sys.exit(1)
    elif args.reset:
        if reset_database():
            print("✅ Database reset successful")
            sys.exit(0)
        else:
            print("❌ Database reset failed")
            sys.exit(1)
    else:
        if init_database():
            print("✅ Database initialization successful")
            sys.exit(0)
        else:
            print("❌ Database initialization failed")
            sys.exit(1)
