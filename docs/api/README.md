# Jelajah Nusantara AI - API Documentation

## Overview

Jelajah Nusantara AI adalah platform perencanaan perjalanan wisata Indonesia yang didukung oleh kecerdasan buatan. API ini menyediakan endpoint untuk:

- Pemrosesan query perjalanan dengan natural language processing
- Generasi itinerary otomatis
- Pencarian dan rekomendasi destinasi
- Analisis sentimen ulasan destinasi
- Chat assistant untuk bantuan perencanaan perjalanan

## Base URL

```
Development: http://localhost:8000
Production: https://api.jelajahnusantara.ai
```

## Authentication

Saat ini API tidak memerlukan autentikasi untuk endpoint publik. Autentikasi akan ditambahkan untuk fitur user-specific di masa mendatang.

## Rate Limiting

- 100 requests per hour per IP address
- Rate limit headers disertakan dalam response

## API Endpoints

### Health Check

#### GET /health

Mengecek status kesehatan API.

**Response:**
```json
{
  "status": "healthy",
  "service": "Jelajah Nusantara AI",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "dependencies": {
    "database": "connected",
    "ai_service": "available"
  }
}
```

### Travel Planning

#### POST /api/v1/travel/query

Memproses query perjalanan dalam bahasa natural menggunakan AI.

**Request Body:**
```json
{
  "query": "Saya ingin liburan 3 hari di Bali bersama keluarga, suka pantai dan kuliner, budget 5 juta",
  "destination": "Bali",           // optional
  "duration": 3,                   // optional
  "budget": 5000000,              // optional
  "traveler_count": 4,            // optional
  "traveler_type": "family",      // optional
  "interests": ["pantai", "kuliner"], // optional
  "start_date": "2024-02-01"      // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Travel query processed successfully",
  "data": {
    "destination": "Bali",
    "duration": 3,
    "budget": 5000000,
    "traveler_count": 4,
    "traveler_type": "family",
    "interests": ["pantai", "kuliner"],
    "activity_level": "moderate",
    "extracted_keywords": ["Bali", "3 hari", "keluarga", "pantai", "kuliner", "5 juta"],
    "confidence": 0.85
  }
}
```

#### POST /api/v1/travel/generate-itinerary

Menghasilkan itinerary lengkap berdasarkan preferensi pengguna.

**Request Body:**
```json
{
  "destination": "Bali",
  "duration": 3,
  "budget": 5000000,
  "traveler_count": 4,
  "traveler_type": "family",
  "interests": ["pantai", "kuliner"],
  "activity_level": "moderate",
  "start_date": "2024-02-01"
}
```

**Response:**
```json
{
  "itinerary": {
    "id": "uuid",
    "title": "Perjalanan 3 Hari ke Bali",
    "description": "Itinerary 3 hari untuk 4 orang di Bali",
    "days": [
      {
        "day": 1,
        "date": "2024-02-01",
        "items": [
          {
            "id": "uuid",
            "destination": {
              "id": "uuid",
              "name": "Pantai Kuta",
              "description": "Pantai terkenal dengan sunset yang indah",
              "location": {
                "latitude": -8.7205,
                "longitude": 115.1693,
                "address": "Jl. Pantai Kuta, Kuta",
                "city": "Badung",
                "province": "Bali"
              },
              "category": "beach",
              "rating": 4.3,
              "price_range": "budget"
            },
            "start_time": "09:00",
            "end_time": "11:00",
            "duration": 120,
            "estimated_cost": 100000,
            "notes": "Kunjungan ke Pantai Kuta"
          }
        ],
        "total_cost": 500000,
        "notes": "Hari 1 - Eksplorasi Bali"
      }
    ],
    "total_cost": 1500000,
    "total_duration": 3,
    "traveler_count": 4,
    "traveler_type": "family",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "ai_reasoning": "Itinerary dibuat berdasarkan preferensi keluarga dengan fokus pada pantai dan kuliner lokal",
  "confidence_score": 0.85,
  "alternative_suggestions": [
    "Pertimbangkan untuk menambah 1 hari untuk eksplorasi lebih mendalam"
  ]
}
```

### Destinations

#### GET /api/v1/destinations/search

Mencari destinasi dengan berbagai filter.

**Query Parameters:**
- `q` (string): Query pencarian
- `category` (string): Kategori destinasi (beach, mountain, cultural, dll)
- `price_range` (string): Rentang harga (budget, moderate, expensive, luxury)
- `city` (string): Filter berdasarkan kota
- `province` (string): Filter berdasarkan provinsi
- `min_rating` (float): Rating minimal (0-5)
- `page` (int): Nomor halaman (default: 1)
- `page_size` (int): Jumlah item per halaman (default: 20, max: 100)

**Response:**
```json
{
  "destinations": [
    {
      "id": "uuid",
      "name": "Pantai Kuta",
      "description": "Pantai terkenal di Bali",
      "location": {
        "latitude": -8.7205,
        "longitude": 115.1693,
        "address": "Jl. Pantai Kuta, Kuta",
        "city": "Badung",
        "province": "Bali"
      },
      "category": "beach",
      "images": ["https://example.com/image1.jpg"],
      "rating": 4.3,
      "review_count": 1250,
      "price_range": "budget",
      "facilities": ["Parkir", "Toilet", "Warung"],
      "tags": ["populer", "instagramable"]
    }
  ],
  "total": 150,
  "query": "pantai bali",
  "filters_applied": {
    "category": "beach",
    "min_rating": 4.0
  }
}
```

#### GET /api/v1/destinations/{destination_id}

Mendapatkan detail destinasi berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Pantai Kuta",
    "description": "Pantai terkenal di Bali dengan sunset yang menakjubkan",
    "location": {
      "latitude": -8.7205,
      "longitude": 115.1693,
      "address": "Jl. Pantai Kuta, Kuta",
      "city": "Badung",
      "province": "Bali"
    },
    "category": "beach",
    "images": ["https://example.com/image1.jpg"],
    "rating": 4.3,
    "review_count": 1250,
    "price_range": "budget",
    "facilities": ["Parkir", "Toilet", "Warung"],
    "tags": ["populer", "instagramable"],
    "sentiment": {
      "overall": 0.7,
      "positive": 0.6,
      "negative": 0.2,
      "neutral": 0.2,
      "keywords": ["bagus", "indah", "recommended"],
      "last_updated": "2024-01-15T10:30:00Z"
    }
  }
}
```

### AI Features

#### POST /api/v1/ai/parse-query

Memparse query natural language menjadi data terstruktur.

**Request Body:**
```json
{
  "query": "Liburan 3 hari di Yogyakarta dengan budget 2 juta"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "destination": "Yogyakarta",
    "duration": 3,
    "budget": 2000000,
    "extracted_keywords": ["Yogyakarta", "3 hari", "2 juta"],
    "confidence": 0.8
  }
}
```

#### POST /api/v1/ai/chat

Chat dengan AI assistant untuk bantuan perencanaan perjalanan.

**Request Body:**
```json
{
  "message": "Rekomendasikan destinasi wisata untuk keluarga di Jawa Tengah",
  "context": {
    "previous_query": "liburan keluarga",
    "budget": 3000000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Untuk liburan keluarga di Jawa Tengah, saya merekomendasikan Candi Borobudur, Malioboro Yogyakarta, dan Dieng Plateau. Destinasi ini ramah keluarga dan sesuai dengan budget Anda.",
    "context": {
      "previous_query": "liburan keluarga",
      "budget": 3000000
    }
  }
}
```

## Error Responses

API menggunakan HTTP status codes standar:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "detail": "Detailed error description"
}
```

## Data Types

### Traveler Types
- `solo` - Wisatawan solo
- `couple` - Pasangan
- `family` - Keluarga
- `friends` - Teman-teman
- `business` - Perjalanan bisnis

### Activity Levels
- `low` - Aktivitas santai
- `moderate` - Aktivitas sedang
- `high` - Aktivitas tinggi

### Destination Categories
- `beach` - Pantai
- `mountain` - Gunung
- `cultural` - Budaya
- `historical` - Sejarah
- `culinary` - Kuliner
- `adventure` - Petualangan
- `religious` - Religi
- `shopping` - Belanja
- `nightlife` - Kehidupan malam
- `nature` - Alam
- `urban` - Perkotaan

### Price Ranges
- `budget` - Budget (< Rp 100,000)
- `moderate` - Sedang (Rp 100,000 - 500,000)
- `expensive` - Mahal (Rp 500,000 - 1,000,000)
- `luxury` - Mewah (> Rp 1,000,000)

## SDK dan Libraries

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- Mobile SDK (React Native)

## Support

Untuk pertanyaan dan dukungan:
- Email: support@jelajahnusantara.ai
- Documentation: https://docs.jelajahnusantara.ai
- GitHub: https://github.com/jelajahnusantara/api
