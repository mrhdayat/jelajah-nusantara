"""
AI Model utilities and configurations
"""

from typing import Dict, Any, List, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class AIProvider(str, Enum):
    """Supported AI providers"""
    IBM_WATSONX = "ibm_watsonx"
    OPENAI = "openai"
    HUGGINGFACE = "huggingface"
    NONE = "none"


class ModelCapability(str, Enum):
    """AI model capabilities"""
    TEXT_GENERATION = "text_generation"
    QUERY_PARSING = "query_parsing"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    ROUTE_OPTIMIZATION = "route_optimization"
    CHAT = "chat"
    TRANSLATION = "translation"


class AIModelConfig:
    """Configuration for AI models"""
    
    # IBM Watsonx Models
    WATSONX_MODELS = {
        "granite-13b-chat-v2": {
            "name": "IBM Granite 13B Chat v2",
            "capabilities": [
                ModelCapability.TEXT_GENERATION,
                ModelCapability.QUERY_PARSING,
                ModelCapability.CHAT,
                ModelCapability.ROUTE_OPTIMIZATION
            ],
            "max_tokens": 8192,
            "languages": ["en", "id"],
            "cost_per_1k_tokens": 0.0005
        },
        "granite-20b-multilingual": {
            "name": "IBM Granite 20B Multilingual",
            "capabilities": [
                ModelCapability.TEXT_GENERATION,
                ModelCapability.QUERY_PARSING,
                ModelCapability.CHAT,
                ModelCapability.TRANSLATION
            ],
            "max_tokens": 8192,
            "languages": ["en", "id", "ms", "th", "vi"],
            "cost_per_1k_tokens": 0.001
        }
    }
    
    # OpenAI Models
    OPENAI_MODELS = {
        "gpt-3.5-turbo": {
            "name": "GPT-3.5 Turbo",
            "capabilities": [
                ModelCapability.TEXT_GENERATION,
                ModelCapability.QUERY_PARSING,
                ModelCapability.CHAT,
                ModelCapability.SENTIMENT_ANALYSIS
            ],
            "max_tokens": 4096,
            "languages": ["en", "id"],
            "cost_per_1k_tokens": 0.002
        },
        "gpt-4": {
            "name": "GPT-4",
            "capabilities": [
                ModelCapability.TEXT_GENERATION,
                ModelCapability.QUERY_PARSING,
                ModelCapability.CHAT,
                ModelCapability.SENTIMENT_ANALYSIS,
                ModelCapability.ROUTE_OPTIMIZATION
            ],
            "max_tokens": 8192,
            "languages": ["en", "id"],
            "cost_per_1k_tokens": 0.03
        }
    }
    
    # Hugging Face Models
    HUGGINGFACE_MODELS = {
        "mistralai/Mistral-7B-Instruct-v0.2": {
            "name": "Mistral 7B Instruct v0.2",
            "capabilities": [
                ModelCapability.TEXT_GENERATION,
                ModelCapability.QUERY_PARSING,
                ModelCapability.CHAT
            ],
            "max_tokens": 32768,
            "languages": ["en"],
            "cost_per_1k_tokens": 0.0002
        },
        "microsoft/DialoGPT-medium": {
            "name": "DialoGPT Medium",
            "capabilities": [
                ModelCapability.CHAT
            ],
            "max_tokens": 1024,
            "languages": ["en"],
            "cost_per_1k_tokens": 0.0001
        },
        "cardiffnlp/twitter-roberta-base-sentiment-latest": {
            "name": "RoBERTa Sentiment Analysis",
            "capabilities": [
                ModelCapability.SENTIMENT_ANALYSIS
            ],
            "max_tokens": 512,
            "languages": ["en"],
            "cost_per_1k_tokens": 0.0001
        }
    }
    
    @classmethod
    def get_model_info(cls, provider: AIProvider, model_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific model"""
        if provider == AIProvider.IBM_WATSONX:
            return cls.WATSONX_MODELS.get(model_id)
        elif provider == AIProvider.OPENAI:
            return cls.OPENAI_MODELS.get(model_id)
        elif provider == AIProvider.HUGGINGFACE:
            return cls.HUGGINGFACE_MODELS.get(model_id)
        return None
    
    @classmethod
    def get_models_by_capability(cls, capability: ModelCapability) -> Dict[str, List[str]]:
        """Get models that support a specific capability"""
        result = {}
        
        # Check Watsonx models
        watsonx_models = []
        for model_id, info in cls.WATSONX_MODELS.items():
            if capability in info["capabilities"]:
                watsonx_models.append(model_id)
        if watsonx_models:
            result[AIProvider.IBM_WATSONX] = watsonx_models
        
        # Check OpenAI models
        openai_models = []
        for model_id, info in cls.OPENAI_MODELS.items():
            if capability in info["capabilities"]:
                openai_models.append(model_id)
        if openai_models:
            result[AIProvider.OPENAI] = openai_models
        
        # Check Hugging Face models
        hf_models = []
        for model_id, info in cls.HUGGINGFACE_MODELS.items():
            if capability in info["capabilities"]:
                hf_models.append(model_id)
        if hf_models:
            result[AIProvider.HUGGINGFACE] = hf_models
        
        return result
    
    @classmethod
    def get_recommended_model(cls, capability: ModelCapability, provider: Optional[AIProvider] = None) -> Optional[Dict[str, str]]:
        """Get recommended model for a specific capability"""
        models_by_capability = cls.get_models_by_capability(capability)
        
        if provider and provider in models_by_capability:
            # Return first model for specified provider
            return {
                "provider": provider,
                "model_id": models_by_capability[provider][0]
            }
        
        # Return best available model (prioritize Watsonx > OpenAI > Hugging Face)
        for preferred_provider in [AIProvider.IBM_WATSONX, AIProvider.OPENAI, AIProvider.HUGGINGFACE]:
            if preferred_provider in models_by_capability:
                return {
                    "provider": preferred_provider,
                    "model_id": models_by_capability[preferred_provider][0]
                }
        
        return None


class AIModelValidator:
    """Validator for AI model responses"""
    
    @staticmethod
    def validate_json_response(response: str) -> bool:
        """Validate if response contains valid JSON"""
        try:
            import json
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                json.loads(json_str)
                return True
            return False
        except:
            return False
    
    @staticmethod
    def extract_json_from_response(response: str) -> Optional[Dict[str, Any]]:
        """Extract JSON object from AI response"""
        try:
            import json
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                return json.loads(json_str)
            return None
        except:
            return None
    
    @staticmethod
    def validate_travel_query_response(response: Dict[str, Any]) -> bool:
        """Validate travel query parsing response"""
        required_fields = ["confidence"]
        optional_fields = [
            "destination", "duration", "budget", "traveler_count",
            "traveler_type", "interests", "activity_level", "extracted_keywords"
        ]
        
        # Check if confidence field exists and is valid
        if "confidence" not in response:
            return False
        
        confidence = response.get("confidence")
        if not isinstance(confidence, (int, float)) or not (0 <= confidence <= 1):
            return False
        
        # Check if at least one optional field has a meaningful value
        has_meaningful_data = any(
            response.get(field) is not None and response.get(field) != ""
            for field in optional_fields
        )
        
        return has_meaningful_data


class AIModelMetrics:
    """Metrics and monitoring for AI models"""
    
    def __init__(self):
        self.request_count = 0
        self.success_count = 0
        self.error_count = 0
        self.total_tokens = 0
        self.total_cost = 0.0
        self.response_times = []
    
    def record_request(self, success: bool, tokens: int = 0, cost: float = 0.0, response_time: float = 0.0):
        """Record metrics for an AI request"""
        self.request_count += 1
        
        if success:
            self.success_count += 1
        else:
            self.error_count += 1
        
        self.total_tokens += tokens
        self.total_cost += cost
        
        if response_time > 0:
            self.response_times.append(response_time)
    
    def get_success_rate(self) -> float:
        """Get success rate percentage"""
        if self.request_count == 0:
            return 0.0
        return (self.success_count / self.request_count) * 100
    
    def get_average_response_time(self) -> float:
        """Get average response time in seconds"""
        if not self.response_times:
            return 0.0
        return sum(self.response_times) / len(self.response_times)
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get comprehensive metrics summary"""
        return {
            "total_requests": self.request_count,
            "successful_requests": self.success_count,
            "failed_requests": self.error_count,
            "success_rate_percent": self.get_success_rate(),
            "total_tokens_used": self.total_tokens,
            "total_cost_usd": self.total_cost,
            "average_response_time_seconds": self.get_average_response_time()
        }
