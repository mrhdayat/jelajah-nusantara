"""
Prompt templates for AI models
"""

from typing import Dict, Any, List


class PromptTemplates:
    """
    Collection of prompt templates for different AI tasks
    """
    
    @staticmethod
    def travel_query_parser(query: str) -> str:
        """
        Template for parsing travel queries into structured data
        """
        return f"""
Anda adalah asisten perencana perjalanan wisata Indonesia yang ahli. Analisis query perjalanan berikut dan ekstrak informasi terstruktur.

PENTING: Berikan respons dalam format JSON yang valid saja, tanpa teks tambahan.

Query: "{query}"

Ekstrak informasi berikut:
- destination: string (nama kota/daerah yang disebutkan, null jika tidak ada)
- duration: integer (jumlah hari perjalanan, null jika tidak disebutkan)
- budget: float (anggaran dalam rupiah, konversi jika disebutkan dalam juta/ribu, null jika tidak ada)
- traveler_count: integer (jumlah orang, null jika tidak disebutkan)
- traveler_type: string (solo/couple/family/friends/business berdasarkan konteks)
- interests: array of strings (minat/aktivitas yang disebutkan seperti pantai, kuliner, budaya, dll)
- activity_level: string (low/moderate/high berdasarkan jenis aktivitas)
- extracted_keywords: array of strings (kata kunci penting dari query)
- confidence: float (0-1, tingkat kepercayaan ekstraksi)

Contoh respons:
{{
  "destination": "Bali",
  "duration": 3,
  "budget": 5000000,
  "traveler_count": 4,
  "traveler_type": "family",
  "interests": ["pantai", "kuliner", "budaya"],
  "activity_level": "moderate",
  "extracted_keywords": ["Bali", "3 hari", "keluarga", "pantai", "kuliner", "5 juta"],
  "confidence": 0.9
}}

JSON Response:
"""

    @staticmethod
    def itinerary_generator(
        destination: str,
        duration: int,
        interests: List[str],
        budget: float,
        traveler_type: str
    ) -> str:
        """
        Template for generating travel itineraries
        """
        interests_str = ", ".join(interests) if interests else "umum"
        
        return f"""
Anda adalah perencana perjalanan wisata Indonesia yang berpengalaman. Buatkan itinerary detail untuk:

Destinasi: {destination}
Durasi: {duration} hari
Minat: {interests_str}
Budget: Rp {budget:,.0f}
Tipe Wisatawan: {traveler_type}

Berikan rekomendasi yang mencakup:
1. Tempat wisata yang sesuai dengan minat dan budget
2. Jadwal harian yang realistis
3. Estimasi biaya per aktivitas
4. Tips transportasi antar lokasi
5. Rekomendasi makanan/restoran lokal

Format respons dalam JSON dengan struktur:
{{
  "days": [
    {{
      "day": 1,
      "theme": "string",
      "activities": [
        {{
          "time": "09:00",
          "activity": "string",
          "location": "string",
          "duration": 120,
          "cost_estimate": 150000,
          "description": "string",
          "tips": "string"
        }}
      ],
      "meals": [
        {{
          "time": "lunch",
          "restaurant": "string",
          "cuisine": "string",
          "cost_estimate": 75000
        }}
      ],
      "total_cost": 500000
    }}
  ],
  "total_budget": {budget},
  "budget_breakdown": {{
    "attractions": 0.4,
    "food": 0.3,
    "transportation": 0.2,
    "miscellaneous": 0.1
  }},
  "tips": ["string"],
  "alternatives": ["string"]
}}

JSON Response:
"""

    @staticmethod
    def destination_recommender(
        preferences: Dict[str, Any],
        location_context: str = "Indonesia"
    ) -> str:
        """
        Template for recommending destinations based on preferences
        """
        return f"""
Anda adalah ahli pariwisata {location_context}. Berdasarkan preferensi berikut, rekomendasikan destinasi wisata yang paling sesuai:

Preferensi:
{preferences}

Berikan 5-10 rekomendasi destinasi dengan format JSON:
{{
  "recommendations": [
    {{
      "name": "string",
      "location": "string",
      "category": "string",
      "match_score": 0.95,
      "reasons": ["string"],
      "best_time": "string",
      "estimated_cost": "string",
      "highlights": ["string"]
    }}
  ],
  "reasoning": "string"
}}

JSON Response:
"""

    @staticmethod
    def sentiment_analyzer(reviews: List[str], destination_name: str) -> str:
        """
        Template for analyzing sentiment of destination reviews
        """
        reviews_text = "\n".join(reviews[:10])  # Limit to first 10 reviews
        
        return f"""
Analisis sentimen untuk ulasan destinasi wisata: {destination_name}

Ulasan:
{reviews_text}

Berikan analisis sentimen dalam format JSON:
{{
  "overall_sentiment": 0.7,
  "sentiment_breakdown": {{
    "positive": 0.6,
    "neutral": 0.3,
    "negative": 0.1
  }},
  "key_themes": {{
    "positive": ["string"],
    "negative": ["string"]
  }},
  "summary": "string",
  "recommendation_score": 0.8,
  "confidence": 0.9
}}

JSON Response:
"""

    @staticmethod
    def route_optimizer(
        destinations: List[str],
        start_point: str,
        preferences: Dict[str, Any]
    ) -> str:
        """
        Template for optimizing travel routes
        """
        destinations_str = ", ".join(destinations)
        
        return f"""
Optimasi rute perjalanan untuk:

Titik Awal: {start_point}
Destinasi: {destinations_str}
Preferensi: {preferences}

Berikan rute optimal dalam format JSON:
{{
  "optimized_route": ["string"],
  "route_details": [
    {{
      "from": "string",
      "to": "string",
      "distance_km": 50,
      "travel_time_minutes": 90,
      "transportation": "string",
      "cost_estimate": 100000
    }}
  ],
  "total_distance": 200,
  "total_time": 360,
  "total_cost": 400000,
  "optimization_score": 0.85,
  "alternatives": ["string"]
}}

JSON Response:
"""

    @staticmethod
    def chat_assistant(message: str, context: Dict[str, Any]) -> str:
        """
        Template for conversational AI assistant
        """
        context_str = str(context) if context else "Tidak ada konteks sebelumnya"
        
        return f"""
Anda adalah asisten perjalanan wisata Indonesia yang ramah dan berpengetahuan luas. 
Jawab pertanyaan pengguna dengan informatif dan membantu.

Konteks percakapan: {context_str}

Pertanyaan: "{message}"

Berikan respons yang:
1. Ramah dan personal
2. Informatif dan akurat
3. Memberikan saran praktis
4. Menggunakan bahasa Indonesia yang natural

Jika diperlukan, sertakan:
- Rekomendasi spesifik
- Tips praktis
- Informasi biaya
- Alternatif pilihan

Respons:
"""

    @staticmethod
    def budget_estimator(
        destination: str,
        duration: int,
        traveler_count: int,
        comfort_level: str = "moderate"
    ) -> str:
        """
        Template for estimating travel budget
        """
        return f"""
Estimasi budget perjalanan untuk:

Destinasi: {destination}
Durasi: {duration} hari
Jumlah Orang: {traveler_count}
Tingkat Kenyamanan: {comfort_level}

Berikan estimasi budget detail dalam format JSON:
{{
  "total_budget": {{
    "min": 2000000,
    "recommended": 3500000,
    "max": 5000000
  }},
  "daily_budget": {{
    "min": 400000,
    "recommended": 700000,
    "max": 1000000
  }},
  "breakdown": {{
    "accommodation": {{
      "percentage": 0.35,
      "amount": 1225000,
      "options": ["string"]
    }},
    "food": {{
      "percentage": 0.25,
      "amount": 875000,
      "options": ["string"]
    }},
    "transportation": {{
      "percentage": 0.20,
      "amount": 700000,
      "options": ["string"]
    }},
    "activities": {{
      "percentage": 0.15,
      "amount": 525000,
      "options": ["string"]
    }},
    "miscellaneous": {{
      "percentage": 0.05,
      "amount": 175000,
      "options": ["string"]
    }}
  }},
  "money_saving_tips": ["string"],
  "splurge_options": ["string"]
}}

JSON Response:
"""
