/**
 * API client for Jelajah Nusantara AI
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { 
  TravelQueryRequest, 
  ItineraryGenerationRequest,
  ItineraryGenerationResponse,
  DestinationSearchResponse,
  ApiResponse 
} from '@/types'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Travel Planning APIs
  async processTravelQuery(request: TravelQueryRequest): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/travel/query', request)
    return response.data
  }

  async generateItinerary(request: ItineraryGenerationRequest): Promise<ItineraryGenerationResponse> {
    const response = await this.client.post('/api/v1/travel/generate-itinerary', request)
    return response.data
  }

  async getItinerary(itineraryId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/api/v1/travel/itinerary/${itineraryId}`)
    return response.data
  }

  async updateItinerary(itineraryId: string, updates: any): Promise<ApiResponse> {
    const response = await this.client.put(`/api/v1/travel/itinerary/${itineraryId}`, updates)
    return response.data
  }

  async deleteItinerary(itineraryId: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/v1/travel/itinerary/${itineraryId}`)
    return response.data
  }

  // Destination APIs
  async searchDestinations(params: {
    q?: string
    category?: string
    price_range?: string
    city?: string
    province?: string
    min_rating?: number
    page?: number
    page_size?: number
  }): Promise<DestinationSearchResponse> {
    const response = await this.client.get('/api/v1/destinations/search', { params })
    return response.data
  }

  async getDestination(destinationId: string): Promise<ApiResponse> {
    const response = await this.client.get(`/api/v1/destinations/${destinationId}`)
    return response.data
  }

  async getDestinationCategories(): Promise<ApiResponse> {
    const response = await this.client.get('/api/v1/destinations/categories/list')
    return response.data
  }

  async getNearbyDestinations(
    destinationId: string, 
    radiusKm: number = 50, 
    limit: number = 10
  ): Promise<ApiResponse> {
    const response = await this.client.get(`/api/v1/destinations/nearby/${destinationId}`, {
      params: { radius_km: radiusKm, limit }
    })
    return response.data
  }

  async analyzeDestinationSentiment(destinationId: string, forceRefresh: boolean = false): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/destinations/sentiment-analysis', {
      destination_id: destinationId,
      force_refresh: forceRefresh
    })
    return response.data
  }

  // AI APIs
  async parseQuery(query: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/ai/parse-query', { query })
    return response.data
  }

  async getAIRecommendations(parsedQuery: any): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/ai/recommendations', parsedQuery)
    return response.data
  }

  async optimizeRoute(
    destinations: string[], 
    startLocation: string, 
    preferences: any
  ): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/ai/optimize-route', {
      destinations,
      start_location: startLocation,
      preferences
    })
    return response.data
  }

  async chatWithAI(message: string, context: any = {}): Promise<ApiResponse> {
    const response = await this.client.post('/api/v1/ai/chat', {
      message,
      context
    })
    return response.data
  }

  async getModelStatus(): Promise<ApiResponse> {
    const response = await this.client.get('/api/v1/ai/model-status')
    return response.data
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health')
    return response.data
  }
}

// Create singleton instance
export const apiClient = new APIClient()

// Export individual methods for easier use
export const {
  generateItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  searchDestinations,
  getDestination,
  getDestinationCategories,
  getNearbyDestinations,
  analyzeDestinationSentiment,
  parseQuery,
  getAIRecommendations,
  optimizeRoute,
  chatWithAI,
  getModelStatus,
  healthCheck
} = apiClient

// Wrapper function with fallback to mock data
export async function processTravelQuery(query: string): Promise<any> {
  try {
    // Try to use the API client
    const response = await apiClient.processTravelQuery({
      query
    })

    // Add AI provider info for demo
    if (response && !(response as any).ai_provider) {
      (response as any).ai_provider = 'backend_api'
    }

    return response
  } catch (error) {
    console.error('Backend not available, using mock data:', error)

    // Return mock itinerary for demo with AI provider info
    return {
      id: 'demo-' + Date.now(),
      title: 'Jelajah Bali 3 Hari 2 Malam',
      description: 'Itinerary wisata Bali yang sempurna untuk liburan keluarga dengan budget terjangkau',
      duration: 3,
      total_budget: 5000000,
      destinations: [
        {
          id: 'dest-1',
          name: 'Pantai Kuta',
          description: 'Pantai terkenal dengan sunset yang indah dan ombak yang cocok untuk surfing',
          category: 'beach',
          location: {
            latitude: -8.7183,
            longitude: 115.1686,
            address: 'Kuta, Badung Regency, Bali'
          },
          rating: 4.5,
          price_range: 'budget',
          estimated_duration: 180,
          best_time_to_visit: 'afternoon',
          activities: ['surfing', 'sunset viewing', 'beach walk'],
          facilities: ['parking', 'restaurant', 'toilet']
        },
        {
          id: 'dest-2',
          name: 'Pura Tanah Lot',
          description: 'Pura Hindu yang terletak di atas batu karang di tepi laut',
          category: 'cultural',
          location: {
            latitude: -8.6211,
            longitude: 115.0868,
            address: 'Tabanan Regency, Bali'
          },
          rating: 4.7,
          price_range: 'budget',
          estimated_duration: 120,
          best_time_to_visit: 'evening',
          activities: ['temple visit', 'photography', 'cultural tour'],
          facilities: ['parking', 'souvenir shop', 'restaurant']
        }
      ],
      itinerary_items: [
        {
          day: 1,
          date: '2024-08-15',
          start_time: '09:00',
          end_time: '12:00',
          destination: {
            id: 'dest-1',
            name: 'Pantai Kuta',
            description: 'Pantai terkenal dengan sunset yang indah',
            category: 'beach',
            location: {
              latitude: -8.7183,
              longitude: 115.1686,
              address: 'Kuta, Badung Regency, Bali'
            },
            rating: 4.5,
            price_range: 'budget'
          },
          duration: 180,
          estimated_cost: 150000,
          activities: ['Jalan-jalan di pantai', 'Menikmati pemandangan'],
          notes: 'Bawa sunscreen dan topi'
        },
        {
          day: 1,
          date: '2024-08-15',
          start_time: '15:00',
          end_time: '18:00',
          destination: {
            id: 'dest-2',
            name: 'Pura Tanah Lot',
            description: 'Pura Hindu yang terletak di atas batu karang',
            category: 'cultural',
            location: {
              latitude: -8.6211,
              longitude: 115.0868,
              address: 'Tabanan Regency, Bali'
            },
            rating: 4.7,
            price_range: 'budget'
          },
          duration: 180,
          estimated_cost: 200000,
          activities: ['Mengunjungi pura', 'Menikmati sunset'],
          notes: 'Waktu terbaik untuk sunset sekitar jam 18:00'
        }
      ],
      budget_breakdown: {
        accommodation: 1500000,
        transportation: 1000000,
        food: 1200000,
        activities: 800000,
        miscellaneous: 500000,
        total: 5000000
      },
      recommendations: {
        best_time_to_visit: 'April - Oktober (musim kemarau)',
        what_to_pack: ['Pakaian ringan', 'Sunscreen', 'Topi', 'Kamera'],
        local_tips: [
          'Selalu tawar harga di pasar tradisional',
          'Hormati adat dan budaya lokal',
          'Coba kuliner lokal seperti nasi gudeg dan sate lilit'
        ]
      },
      ai_provider: "frontend_mock",
      ai_provider_display: "Mock Data (Frontend)",
      generated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      note: "Demo data - Backend tidak tersedia, menggunakan mock data frontend"
    }
  }
}
