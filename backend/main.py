"""
Jelajah Nusantara AI - Main FastAPI Application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import settings
from app.core.config import settings
# Import routers
from app.api.routes import travel, ai, destinations

app = FastAPI(
    title="Jelajah Nusantara AI API",
    description="AI-powered travel planning platform for Indonesia",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins, # Menggunakan konfigurasi dari settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Jelajah Nusantara AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Jelajah Nusantara AI API"
    }

# Include API routers
app.include_router(travel.router, prefix="/api/v1/travel", tags=["travel"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(destinations.router, prefix="/api/v1/destinations", tags=["destinations"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else "An error occurred"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )