"""
AI Service for natural language processing and travel recommendations
"""

import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, date

from app.models.schemas import ParsedTravelQuery, TravelerType, ActivityLevel
# from app.core.config import get_ai_config  # Temporarily disabled
from app.utils.prompt_templates import PromptTemplates

logger = logging.getLogger(__name__)


class AIService:
    """
    Service for AI-powered travel planning features
    """
    
    def __init__(self):
        self.ai_config = get_ai_config()
        self.provider = self.ai_config.get("provider", "none")
        self._client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize AI client based on configuration"""
        try:
            if self.provider == "ibm_watsonx":
                self._initialize_watsonx_client()
            elif self.provider == "openai":
                self._initialize_openai_client()
            elif self.provider == "huggingface":
                self._initialize_huggingface_client()
            else:
                logger.warning("No AI provider configured. AI features will be limited.")
        except Exception as e:
            logger.error(f"Failed to initialize AI client: {str(e)}")
            self.provider = "none"
    
    def _initialize_watsonx_client(self):
        """Initialize IBM Watsonx client"""
        try:
            from ibm_watsonx_ai import APIClient
            from ibm_watsonx_ai import Credentials
            
            credentials = Credentials(
                url=self.ai_config["url"],
                api_key=self.ai_config["api_key"]
            )
            
            self._client = APIClient(credentials)
            logger.info("IBM Watsonx client initialized successfully")
            
        except ImportError:
            logger.error("IBM Watsonx AI library not installed. Install with: pip install ibm-watsonx-ai")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize IBM Watsonx client: {str(e)}")
            raise
    
    def _initialize_openai_client(self):
        """Initialize OpenAI client"""
        try:
            import openai
            
            openai.api_key = self.ai_config["api_key"]
            self._client = openai
            logger.info("OpenAI client initialized successfully")
            
        except ImportError:
            logger.error("OpenAI library not installed. Install with: pip install openai")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {str(e)}")
            raise
    
    def _initialize_huggingface_client(self):
        """Initialize Hugging Face client"""
        try:
            from transformers import pipeline
            
            # Use a lightweight model for development
            self._client = pipeline(
                "text-generation",
                model=settings.huggingface_model,
                token=self.ai_config["api_key"]
            )
            logger.info("Hugging Face client initialized successfully")
            
        except ImportError:
            logger.error("Transformers library not installed. Install with: pip install transformers torch")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize Hugging Face client: {str(e)}")
            raise
    
    async def parse_travel_query(self, query: str) -> ParsedTravelQuery:
        """
        Parse natural language travel query into structured data
        """
        try:
            if self.provider == "none":
                return self._fallback_parse_query(query)
            
            prompt = self._create_parsing_prompt(query)
            
            if self.provider == "ibm_watsonx":
                response = await self._call_watsonx(prompt)
            elif self.provider == "openai":
                response = await self._call_openai(prompt)
            elif self.provider == "huggingface":
                response = await self._call_huggingface(prompt)
            else:
                return self._fallback_parse_query(query)
            
            return self._parse_ai_response(response, query)
            
        except Exception as e:
            logger.error(f"Error parsing travel query: {str(e)}")
            return self._fallback_parse_query(query)
    
    def _create_parsing_prompt(self, query: str) -> str:
        """Create prompt for parsing travel query"""
        return PromptTemplates.travel_query_parser(query)
    
    async def _call_watsonx(self, prompt: str) -> str:
        """Call IBM Watsonx API"""
        try:
            from ibm_watsonx_ai.foundation_models import Model
            from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

            # Model parameters
            parameters = {
                GenParams.DECODING_METHOD: "greedy",
                GenParams.MAX_NEW_TOKENS: 500,
                GenParams.MIN_NEW_TOKENS: 1,
                GenParams.TEMPERATURE: 0.3,
                GenParams.STOP_SEQUENCES: ["\n\n"]
            }

            # Initialize model
            model = Model(
                model_id=self.ai_config["model"],
                params=parameters,
                credentials=self._client.credentials,
                project_id=self.ai_config["project_id"]
            )

            # Generate response
            response = model.generate_text(prompt=prompt)
            return response

        except ImportError:
            logger.warning("IBM Watsonx library not available, using fallback")
            # Fallback response for development
            response = {
                "destination": "Bali",
                "duration": 3,
                "budget": 5000000,
                "traveler_count": 2,
                "traveler_type": "family",
                "interests": ["pantai", "kuliner"],
                "activity_level": "moderate",
                "extracted_keywords": ["Bali", "3 hari", "keluarga", "pantai", "kuliner", "5 juta"],
                "confidence": 0.85
            }
            return json.dumps(response)

        except Exception as e:
            logger.error(f"Error calling Watsonx: {str(e)}")
            raise
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        try:
            import openai

            client = openai.AsyncOpenAI(api_key=self.ai_config["api_key"])

            response = await client.chat.completions.create(
                model=self.ai_config["model"],
                messages=[
                    {
                        "role": "system",
                        "content": "You are a travel planning assistant for Indonesia. Extract structured information from natural language travel queries and respond with valid JSON only."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )

            return response.choices[0].message.content

        except ImportError:
            logger.warning("OpenAI library not available, using fallback")
            # Fallback response for development
            response = {
                "destination": "Jakarta",
                "duration": 2,
                "budget": 3000000,
                "traveler_count": 1,
                "traveler_type": "solo",
                "interests": ["kuliner", "budaya"],
                "activity_level": "moderate",
                "extracted_keywords": ["Jakarta", "2 hari", "solo", "kuliner", "budaya"],
                "confidence": 0.75
            }
            return json.dumps(response)

        except Exception as e:
            logger.error(f"Error calling OpenAI: {str(e)}")
            raise
    
    async def _call_huggingface(self, prompt: str) -> str:
        """Call Hugging Face model"""
        try:
            # For Hugging Face Inference API
            import httpx

            headers = {"Authorization": f"Bearer {self.ai_config['api_key']}"}

            # Use Hugging Face Inference API for better performance
            api_url = f"https://api-inference.huggingface.co/models/{settings.huggingface_model}"

            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 500,
                    "temperature": 0.3,
                    "return_full_text": False
                }
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(api_url, headers=headers, json=payload)

                if response.status_code == 200:
                    result = response.json()
                    if isinstance(result, list) and len(result) > 0:
                        return result[0].get("generated_text", "")
                    return str(result)
                else:
                    logger.warning(f"Hugging Face API error: {response.status_code}")
                    raise Exception(f"API error: {response.status_code}")

        except ImportError:
            logger.warning("Required libraries not available, using fallback")
            # Fallback response for development
            response = {
                "destination": "Yogyakarta",
                "duration": 3,
                "budget": 2500000,
                "traveler_count": 2,
                "traveler_type": "couple",
                "interests": ["budaya", "sejarah"],
                "activity_level": "moderate",
                "extracted_keywords": ["Yogyakarta", "3 hari", "couple", "budaya", "sejarah"],
                "confidence": 0.70
            }
            return json.dumps(response)

        except Exception as e:
            logger.error(f"Error calling Hugging Face: {str(e)}")
            # Return fallback response instead of raising
            response = {
                "destination": None,
                "duration": None,
                "budget": None,
                "traveler_count": None,
                "traveler_type": None,
                "interests": [],
                "activity_level": "moderate",
                "extracted_keywords": [],
                "confidence": 0.3
            }
            return json.dumps(response)
    
    def _parse_ai_response(self, response: str, original_query: str) -> ParsedTravelQuery:
        """Parse AI response into ParsedTravelQuery object"""
        try:
            # Try to extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = response[json_start:json_end]
                data = json.loads(json_str)
            else:
                # Fallback if no JSON found
                return self._fallback_parse_query(original_query)
            
            return ParsedTravelQuery(
                destination=data.get("destination"),
                duration=data.get("duration"),
                budget=data.get("budget"),
                traveler_count=data.get("traveler_count"),
                traveler_type=TravelerType(data.get("traveler_type")) if data.get("traveler_type") else None,
                interests=data.get("interests", []),
                activity_level=ActivityLevel(data.get("activity_level")) if data.get("activity_level") else None,
                extracted_keywords=data.get("extracted_keywords", []),
                confidence=data.get("confidence", 0.5)
            )
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return self._fallback_parse_query(original_query)
    
    def _fallback_parse_query(self, query: str) -> ParsedTravelQuery:
        """Fallback parsing using simple keyword matching"""
        query_lower = query.lower()
        
        # Simple keyword extraction
        keywords = []
        destination = None
        duration = None
        budget = None
        traveler_count = None
        traveler_type = None
        interests = []
        
        # Extract destination (common Indonesian destinations)
        destinations = ["bali", "jakarta", "yogyakarta", "bandung", "surabaya", "lombok", "flores", "komodo"]
        for dest in destinations:
            if dest in query_lower:
                destination = dest.title()
                keywords.append(dest)
                break
        
        # Extract duration
        import re
        duration_match = re.search(r'(\d+)\s*hari', query_lower)
        if duration_match:
            duration = int(duration_match.group(1))
            keywords.append(f"{duration} hari")
        
        # Extract budget
        budget_match = re.search(r'(\d+)\s*juta', query_lower)
        if budget_match:
            budget = int(budget_match.group(1)) * 1000000
            keywords.append(f"{budget_match.group(1)} juta")
        
        # Extract traveler type
        if any(word in query_lower for word in ["keluarga", "family"]):
            traveler_type = TravelerType.FAMILY
            keywords.append("keluarga")
        elif any(word in query_lower for word in ["pasangan", "couple"]):
            traveler_type = TravelerType.COUPLE
            keywords.append("pasangan")
        elif any(word in query_lower for word in ["teman", "friends"]):
            traveler_type = TravelerType.FRIENDS
            keywords.append("teman")
        
        # Extract interests
        interest_keywords = {
            "pantai": ["pantai", "beach"],
            "kuliner": ["kuliner", "makanan", "food"],
            "budaya": ["budaya", "culture", "sejarah"],
            "alam": ["alam", "nature", "gunung"],
            "adventure": ["adventure", "petualangan"]
        }
        
        for interest, terms in interest_keywords.items():
            if any(term in query_lower for term in terms):
                interests.append(interest)
                keywords.extend([term for term in terms if term in query_lower])
        
        return ParsedTravelQuery(
            destination=destination,
            duration=duration,
            budget=budget,
            traveler_count=traveler_count,
            traveler_type=traveler_type,
            interests=interests,
            extracted_keywords=keywords,
            confidence=0.6  # Lower confidence for fallback parsing
        )
    
    async def get_recommendations(self, parsed_query: ParsedTravelQuery) -> Dict[str, Any]:
        """Get AI-powered recommendations based on parsed query"""
        try:
            preferences = {
                "destination": parsed_query.destination,
                "interests": parsed_query.interests,
                "budget": parsed_query.budget,
                "traveler_type": parsed_query.traveler_type.value if parsed_query.traveler_type else None,
                "activity_level": parsed_query.activity_level.value if parsed_query.activity_level else "moderate"
            }

            prompt = PromptTemplates.destination_recommender(preferences)

            if self.provider != "none":
                if self.provider == "ibm_watsonx":
                    response = await self._call_watsonx(prompt)
                elif self.provider == "openai":
                    response = await self._call_openai(prompt)
                elif self.provider == "huggingface":
                    response = await self._call_huggingface(prompt)

                # Parse AI response
                try:
                    json_start = response.find('{')
                    json_end = response.rfind('}') + 1
                    if json_start != -1 and json_end > json_start:
                        json_str = response[json_start:json_end]
                        return json.loads(json_str)
                except:
                    pass

            # Fallback recommendations
            return self._generate_fallback_recommendations(parsed_query)

        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return self._generate_fallback_recommendations(parsed_query)

    def _generate_fallback_recommendations(self, parsed_query: ParsedTravelQuery) -> Dict[str, Any]:
        """Generate fallback recommendations when AI is not available"""
        destination = parsed_query.destination or "Indonesia"

        return {
            "recommendations": [
                {
                    "name": f"Destinasi Populer di {destination}",
                    "location": destination,
                    "category": "cultural",
                    "match_score": 0.8,
                    "reasons": ["Sesuai dengan minat Anda", "Dalam budget"],
                    "best_time": "Sepanjang tahun",
                    "estimated_cost": "Moderate",
                    "highlights": ["Pemandangan indah", "Budaya lokal", "Kuliner khas"]
                }
            ],
            "reasoning": "Rekomendasi berdasarkan preferensi umum dan popularitas destinasi"
        }
    
    async def optimize_route(self, destinations: List[str], start_location: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize travel route using AI"""
        try:
            prompt = PromptTemplates.route_optimizer(destinations, start_location, preferences)

            if self.provider != "none":
                if self.provider == "ibm_watsonx":
                    response = await self._call_watsonx(prompt)
                elif self.provider == "openai":
                    response = await self._call_openai(prompt)
                elif self.provider == "huggingface":
                    response = await self._call_huggingface(prompt)

                # Parse AI response
                try:
                    json_start = response.find('{')
                    json_end = response.rfind('}') + 1
                    if json_start != -1 and json_end > json_start:
                        json_str = response[json_start:json_end]
                        return json.loads(json_str)
                except:
                    pass

            # Fallback optimization (simple ordering)
            return {
                "optimized_route": destinations,
                "route_details": [
                    {
                        "from": start_location if i == 0 else destinations[i-1],
                        "to": dest,
                        "distance_km": 50,
                        "travel_time_minutes": 90,
                        "transportation": "car",
                        "cost_estimate": 100000
                    }
                    for i, dest in enumerate(destinations)
                ],
                "total_distance": len(destinations) * 50,
                "total_time": len(destinations) * 90,
                "total_cost": len(destinations) * 100000,
                "optimization_score": 0.7,
                "alternatives": ["Pertimbangkan transportasi umum untuk menghemat biaya"]
            }

        except Exception as e:
            logger.error(f"Error optimizing route: {str(e)}")
            return {
                "optimized_route": destinations,
                "total_distance": 0,
                "estimated_time": 0,
                "optimization_score": 0.5
            }
    
    async def chat(self, message: str, context: Dict[str, Any]) -> str:
        """Chat with AI assistant"""
        try:
            prompt = PromptTemplates.chat_assistant(message, context)

            if self.provider != "none":
                if self.provider == "ibm_watson":
                    response = await self._call_ibm_watson(prompt)
                elif self.provider == "ibm_watsonx":
                    response = await self._call_watsonx(prompt)
                elif self.provider == "replicate":
                    response = await self._call_replicate(prompt)
                elif self.provider == "openai":
                    response = await self._call_openai(prompt)
                elif self.provider == "huggingface":
                    response = await self._call_huggingface(prompt)

                return response.strip()

            # Fallback response
            return self._generate_fallback_chat_response(message, context)

        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            return "Maaf, saya mengalami kesulitan memproses pertanyaan Anda. Silakan coba lagi."

    async def _call_ibm_watson(self, prompt: str) -> str:
        """Call IBM Watson Orchestrate API"""
        try:
            import aiohttp

            headers = {
                "Authorization": f"Bearer {self.ai_config['api_key']}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.ai_config.get("model", "granite-13b-chat-v2"),
                "prompt": prompt,
                "max_tokens": 500,
                "temperature": 0.3,
                "project_id": self.ai_config.get("project_id")
            }

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.ai_config['url']}/v1/generate",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("generated_text", "")
                    else:
                        raise Exception(f"IBM Watson API error: {response.status}")

        except Exception as e:
            logger.error(f"Error calling IBM Watson: {str(e)}")
            raise

    async def _call_replicate(self, prompt: str) -> str:
        """Call Replicate API for IBM Granite model"""
        try:
            import replicate

            # Initialize Replicate client
            client = replicate.Client(api_token=self.ai_config["api_token"])

            # Call IBM Granite model via Replicate
            output = client.run(
                self.ai_config.get("model", "ibm-granite/granite-3.3-8b-instruct"),
                input={
                    "prompt": prompt,
                    "max_tokens": 500,
                    "temperature": 0.3,
                    "top_p": 0.9
                }
            )

            # Replicate returns a generator, join the output
            if hasattr(output, '__iter__'):
                return ''.join(output)
            else:
                return str(output)

        except Exception as e:
            logger.error(f"Error calling Replicate: {str(e)}")
            raise

    def _generate_fallback_chat_response(self, message: str, context: Dict[str, Any]) -> str:
        """Generate fallback chat response"""
        message_lower = message.lower()

        if any(word in message_lower for word in ["halo", "hai", "hello"]):
            return "Halo! Saya adalah asisten perjalanan Jelajah Nusantara AI. Ada yang bisa saya bantu untuk merencanakan perjalanan Anda?"

        elif any(word in message_lower for word in ["budget", "biaya", "harga"]):
            return "Untuk estimasi budget perjalanan, saya bisa membantu menghitung berdasarkan destinasi, durasi, dan preferensi Anda. Bisa ceritakan rencana perjalanan Anda?"

        elif any(word in message_lower for word in ["rekomendasi", "saran", "destinasi"]):
            return "Saya bisa memberikan rekomendasi destinasi wisata di Indonesia berdasarkan minat Anda. Apa jenis wisata yang Anda sukai? Pantai, gunung, budaya, atau kuliner?"

        elif any(word in message_lower for word in ["cuaca", "waktu", "musim"]):
            return "Waktu terbaik untuk berkunjung tergantung destinasi. Secara umum, musim kemarau (April-Oktober) cocok untuk sebagian besar destinasi di Indonesia."

        else:
            return "Terima kasih atas pertanyaan Anda. Saya siap membantu merencanakan perjalanan wisata Anda di Indonesia. Silakan ceritakan lebih detail tentang rencana perjalanan Anda."

    async def estimate_budget(
        self,
        destination: str,
        duration: int,
        traveler_count: int,
        comfort_level: str = "moderate"
    ) -> Dict[str, Any]:
        """Estimate travel budget using AI"""
        try:
            prompt = PromptTemplates.budget_estimator(destination, duration, traveler_count, comfort_level)

            if self.provider != "none":
                if self.provider == "ibm_watsonx":
                    response = await self._call_watsonx(prompt)
                elif self.provider == "openai":
                    response = await self._call_openai(prompt)
                elif self.provider == "huggingface":
                    response = await self._call_huggingface(prompt)

                # Parse AI response
                try:
                    json_start = response.find('{')
                    json_end = response.rfind('}') + 1
                    if json_start != -1 and json_end > json_start:
                        json_str = response[json_start:json_end]
                        return json.loads(json_str)
                except:
                    pass

            # Fallback budget estimation
            base_daily_budget = {
                "budget": 300000,
                "moderate": 600000,
                "luxury": 1200000
            }.get(comfort_level, 600000)

            total_budget = base_daily_budget * duration * traveler_count

            return {
                "total_budget": {
                    "min": total_budget * 0.7,
                    "recommended": total_budget,
                    "max": total_budget * 1.5
                },
                "daily_budget": {
                    "min": base_daily_budget * 0.7,
                    "recommended": base_daily_budget,
                    "max": base_daily_budget * 1.5
                },
                "breakdown": {
                    "accommodation": {"percentage": 0.35, "amount": total_budget * 0.35},
                    "food": {"percentage": 0.25, "amount": total_budget * 0.25},
                    "transportation": {"percentage": 0.20, "amount": total_budget * 0.20},
                    "activities": {"percentage": 0.15, "amount": total_budget * 0.15},
                    "miscellaneous": {"percentage": 0.05, "amount": total_budget * 0.05}
                }
            }

        except Exception as e:
            logger.error(f"Error estimating budget: {str(e)}")
            raise
