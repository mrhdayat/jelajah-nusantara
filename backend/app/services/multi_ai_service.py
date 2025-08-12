"""
Multi AI Service untuk IBM Jakarta Demo
Supports: IBM Watson Orchestrate, Replicate (IBM Granite), Hugging Face
"""

import os
import json
import asyncio
import aiohttp
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

class MultiAIService:
    def __init__(self):
        self.ai_provider = os.getenv('AI_PROVIDER', 'ibm_watson')
        
        # IBM Watson Orchestrate Configuration
        self.ibm_watson_api_key = os.getenv('IBM_WATSON_API_KEY')
        self.ibm_watson_url = os.getenv('IBM_WATSON_URL')
        
        # Replicate Configuration (IBM Granite Model)
        self.replicate_api_token = os.getenv('REPLICATE_API_TOKEN')
        self.replicate_model = os.getenv('REPLICATE_MODEL', 'ibm-granite/granite-3.3-8b-instruct')
        
        # Hugging Face Configuration (Fallback)
        self.huggingface_api_token = os.getenv('HUGGINGFACE_API_TOKEN')
        self.huggingface_model = os.getenv('HUGGINGFACE_MODEL', 'microsoft/DialoGPT-medium')
        
        logger.info(f"Multi AI Service initialized with provider: {self.ai_provider}")
        logger.info(f"IBM Watson available: {bool(self.ibm_watson_api_key)}")
        logger.info(f"Replicate available: {bool(self.replicate_api_token)}")
        logger.info(f"Hugging Face available: {bool(self.huggingface_api_token)}")

    async def process_travel_query(self, query: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process travel query using available AI providers with fallback chain:
        1. IBM Watson Orchestrate (Primary - for IBM demo)
        2. Replicate IBM Granite (Backup - still IBM model)
        3. Hugging Face (Fallback)
        4. Mock data (Final fallback)
        """
        
        # Try IBM Watson Orchestrate first
        if self.ai_provider == 'ibm_watson' and self.ibm_watson_api_key:
            try:
                logger.info("🔵 Attempting IBM Watson Orchestrate...")
                result = await self._process_with_ibm_watson(query, preferences)
                if result:
                    logger.info("✅ IBM Watson Orchestrate successful")
                    return result
            except Exception as e:
                logger.warning(f"❌ IBM Watson failed: {e}")
        
        # Try Replicate IBM Granite as backup
        if self.replicate_api_token:
            try:
                logger.info("🟡 Attempting Replicate IBM Granite...")
                result = await self._process_with_replicate(query, preferences)
                if result:
                    logger.info("✅ Replicate IBM Granite successful")
                    return result
            except Exception as e:
                logger.warning(f"❌ Replicate failed: {e}")
        
        # Try Hugging Face as fallback
        if self.huggingface_api_token:
            try:
                logger.info("🟢 Attempting Hugging Face...")
                result = await self._process_with_huggingface(query, preferences)
                if result:
                    logger.info("✅ Hugging Face successful")
                    return result
            except Exception as e:
                logger.warning(f"❌ Hugging Face failed: {e}")
        
        # Final fallback to mock data
        logger.info("🔴 All AI providers failed, using mock data")
        return self._generate_mock_itinerary(query, preferences)

    async def _process_with_ibm_watson(self, query: str, preferences: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Process with IBM Watson Orchestrate"""
        
        if not self.ibm_watson_api_key or not self.ibm_watson_url:
            return None
            
        headers = {
            'Authorization': f'Bearer {self.ibm_watson_api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        # Construct prompt for travel planning
        prompt = self._construct_travel_prompt(query, preferences)
        
        payload = {
            "input": {
                "text": prompt
            },
            "parameters": {
                "max_new_tokens": 1000,
                "temperature": 0.7,
                "top_p": 0.9
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.ibm_watson_url}/v1/text/generation",
                headers=headers,
                json=payload,
                timeout=30
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_ai_response(data.get('results', [{}])[0].get('generated_text', ''), 'ibm_watson')
                else:
                    logger.error(f"IBM Watson error: {response.status}")
                    return None

    async def _process_with_replicate(self, query: str, preferences: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Process with Replicate IBM Granite model"""
        
        if not self.replicate_api_token:
            return None
            
        headers = {
            'Authorization': f'Token {self.replicate_api_token}',
            'Content-Type': 'application/json'
        }
        
        prompt = self._construct_travel_prompt(query, preferences)
        
        payload = {
            "version": "latest",
            "input": {
                "prompt": prompt,
                "max_tokens": 1000,
                "temperature": 0.7,
                "top_p": 0.9
            }
        }
        
        async with aiohttp.ClientSession() as session:
            # Start prediction
            async with session.post(
                f"https://api.replicate.com/v1/models/{self.replicate_model}/predictions",
                headers=headers,
                json=payload,
                timeout=30
            ) as response:
                if response.status == 201:
                    prediction = await response.json()
                    prediction_id = prediction['id']
                    
                    # Poll for completion
                    for _ in range(30):  # Max 30 attempts (30 seconds)
                        await asyncio.sleep(1)
                        async with session.get(
                            f"https://api.replicate.com/v1/predictions/{prediction_id}",
                            headers=headers
                        ) as poll_response:
                            if poll_response.status == 200:
                                result = await poll_response.json()
                                if result['status'] == 'succeeded':
                                    output = ''.join(result['output']) if isinstance(result['output'], list) else result['output']
                                    return self._parse_ai_response(output, 'replicate_granite')
                                elif result['status'] == 'failed':
                                    logger.error(f"Replicate prediction failed: {result.get('error')}")
                                    return None
                    
                    logger.error("Replicate prediction timeout")
                    return None
                else:
                    logger.error(f"Replicate error: {response.status}")
                    return None

    async def _process_with_huggingface(self, query: str, preferences: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Process with Hugging Face"""
        
        if not self.huggingface_api_token:
            return None
            
        headers = {
            'Authorization': f'Bearer {self.huggingface_api_token}',
            'Content-Type': 'application/json'
        }
        
        prompt = self._construct_travel_prompt(query, preferences)
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 1000,
                "temperature": 0.7,
                "top_p": 0.9,
                "do_sample": True
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://api-inference.huggingface.co/models/{self.huggingface_model}",
                headers=headers,
                json=payload,
                timeout=30
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list) and len(data) > 0:
                        generated_text = data[0].get('generated_text', '')
                        return self._parse_ai_response(generated_text, 'huggingface')
                    return None
                else:
                    logger.error(f"Hugging Face error: {response.status}")
                    return None

    def _construct_travel_prompt(self, query: str, preferences: Dict[str, Any] = None) -> str:
        """Construct travel planning prompt"""
        
        prompt = f"""
Anda adalah AI travel planner expert untuk Indonesia. Buatkan itinerary travel berdasarkan permintaan berikut:

PERMINTAAN: {query}

PREFERENSI:
"""
        
        if preferences:
            for key, value in preferences.items():
                prompt += f"- {key}: {value}\n"
        
        prompt += """
INSTRUKSI:
1. Buat itinerary yang detail dan praktis untuk Indonesia
2. Sertakan estimasi budget dalam Rupiah
3. Rekomendasikan destinasi wisata Indonesia yang sesuai
4. Berikan tips praktis untuk perjalanan
5. Format response dalam JSON dengan struktur:
{
  "title": "Judul Itinerary",
  "duration": "durasi dalam hari",
  "total_budget": "estimasi budget total",
  "destinations": ["list destinasi"],
  "daily_schedule": ["jadwal harian"],
  "tips": ["tips perjalanan"]
}

RESPONSE (JSON only):
"""
        
        return prompt

    def _parse_ai_response(self, response_text: str, provider: str) -> Dict[str, Any]:
        """Parse AI response and extract itinerary data"""
        
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
                data['ai_provider'] = provider
                data['generated_at'] = datetime.now().isoformat()
                return data
        except Exception as e:
            logger.warning(f"Failed to parse AI response as JSON: {e}")
        
        # Fallback: create structured response from text
        return {
            "title": "Itinerary Wisata Indonesia",
            "description": response_text[:200] + "..." if len(response_text) > 200 else response_text,
            "ai_provider": provider,
            "generated_at": datetime.now().isoformat(),
            "raw_response": response_text
        }

    def _generate_mock_itinerary(self, query: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate mock itinerary when all AI providers fail"""
        
        return {
            "id": f"mock-{int(datetime.now().timestamp())}",
            "title": "Jelajah Bali 3 Hari 2 Malam",
            "description": f"Itinerary berdasarkan: {query[:100]}...",
            "duration": 3,
            "total_budget": 5000000,
            "destinations": [
                {
                    "name": "Pantai Kuta",
                    "category": "beach",
                    "description": "Pantai terkenal dengan sunset indah",
                    "estimated_cost": 150000
                },
                {
                    "name": "Pura Tanah Lot", 
                    "category": "cultural",
                    "description": "Pura Hindu di atas batu karang",
                    "estimated_cost": 200000
                }
            ],
            "daily_schedule": [
                {
                    "day": 1,
                    "activities": ["Tiba di Bali", "Check-in hotel", "Jelajah Pantai Kuta"],
                    "estimated_cost": 1500000
                },
                {
                    "day": 2,
                    "activities": ["Kunjungi Pura Tanah Lot", "Sunset viewing", "Kuliner lokal"],
                    "estimated_cost": 1800000
                }
            ],
            "tips": [
                "Bawa sunscreen untuk perlindungan kulit",
                "Hormati adat dan budaya lokal",
                "Coba kuliner khas Bali"
            ],
            "ai_provider": "mock_data",
            "generated_at": datetime.now().isoformat(),
            "note": "Demo data - AI providers tidak tersedia"
        }

# Global instance
multi_ai_service = MultiAIService()
