"""
Configuration settings for Jelajah Nusantara AI
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Optional
import os


class Settings(BaseSettings):
    # Application
    app_name: str = "Jelajah Nusantara AI"
    debug: bool = False
    secret_key: str = "your-secret-key-change-in-production"
    environment: str = "development"

    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080"]

    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/jelajah_nusantara"

    # AI Provider Selection
    ai_provider: str = "none"  # ibm_watson, ibm_watsonx, replicate, openai, huggingface, none

    # AI Configuration - IBM Watson Orchestrate
    ibm_watson_api_key: Optional[str] = None
    ibm_watson_url: str = "https://dl.watson-orchestrate.ibm.com"
    ibm_watson_project_id: Optional[str] = None
    ibm_watson_model: str = "granite-13b-chat-v2"

    # AI Configuration - IBM Watsonx
    ibm_watsonx_api_key: Optional[str] = None
    ibm_watsonx_project_id: Optional[str] = None
    ibm_watsonx_url: str = "https://us-south.ml.cloud.ibm.com"
    ibm_watsonx_model: str = "granite-13b-chat-v2"

    # AI Configuration - Replicate
    replicate_api_token: Optional[str] = None
    replicate_model: str = "ibm-granite/granite-3.3-8b-instruct"

    # AI Configuration - OpenAI (Fallback)
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-3.5-turbo"

    # AI Configuration - Hugging Face
    huggingface_api_token: Optional[str] = None
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.2"

    # Google Maps API
    google_maps_api_key: Optional[str] = None

    # Mapbox API
    mapbox_access_token: Optional[str] = None

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
def get_settings():
    return Settings()

settings = get_settings()


def get_database_url() -> str:
    """Get database URL with proper formatting"""
    return get_settings().database_url


def get_ai_config() -> dict:
    """Get AI configuration based on provider selection"""
    settings = get_settings()
    config = {
        "provider": settings.ai_provider,
        "model": None,
        "api_key": None
    }

    # Configure based on selected provider
    if settings.ai_provider == "ibm_watson":
        if settings.ibm_watson_api_key:
            config.update({
                "provider": "ibm_watson",
                "model": settings.ibm_watson_model,
                "api_key": settings.ibm_watson_api_key,
                "project_id": settings.ibm_watson_project_id,
                "url": settings.ibm_watson_url
            })
        else:
            config["provider"] = "none"

    elif settings.ai_provider == "ibm_watsonx":
        if settings.ibm_watsonx_api_key and settings.ibm_watsonx_project_id:
            config.update({
                "provider": "ibm_watsonx",
                "model": settings.ibm_watsonx_model,
                "api_key": settings.ibm_watsonx_api_key,
                "project_id": settings.ibm_watsonx_project_id,
                "url": settings.ibm_watsonx_url
            })
        else:
            config["provider"] = "none"

    elif settings.ai_provider == "replicate":
        if settings.replicate_api_token:
            config.update({
                "provider": "replicate",
                "model": settings.replicate_model,
                "api_token": settings.replicate_api_token
            })
        else:
            config["provider"] = "none"

    elif settings.ai_provider == "openai":
        if settings.openai_api_key:
            config.update({
                "provider": "openai",
                "model": settings.openai_model,
                "api_key": settings.openai_api_key
            })
        else:
            config["provider"] = "none"

    elif settings.ai_provider == "huggingface":
        if settings.huggingface_api_token:
            config.update({
                "provider": "huggingface",
                "model": settings.huggingface_model,
                "api_key": settings.huggingface_api_token
            })
        else:
            config["provider"] = "none"

    return config


def get_maps_config() -> dict:
    """Get maps configuration"""
    settings = get_settings()
    config = {
        "provider": "none",
        "api_key": None
    }

    if settings.google_maps_api_key:
        config.update({
            "provider": "google_maps",
            "api_key": settings.google_maps_api_key
        })
    elif settings.mapbox_access_token:
        config.update({
            "provider": "mapbox",
            "api_key": settings.mapbox_access_token
        })

    return config
