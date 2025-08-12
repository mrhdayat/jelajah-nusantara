// Core types for the application

export interface Destination {
  id: string
  name: string
  description: string
  location: {
    latitude: number
    longitude: number
    address: string
    city: string
    province: string
  }
  category: DestinationCategory
  images: string[]
  rating: number
  reviewCount: number
  priceRange: PriceRange
  openingHours?: OpeningHours
  facilities: string[]
  tags: string[]
  sentiment?: SentimentAnalysis
}

export interface ItineraryItem {
  id: string
  destination: Destination
  startTime: string
  endTime: string
  duration: number // in minutes
  notes?: string
  estimatedCost: number
  transportationToNext?: Transportation
}

export interface Itinerary {
  id: string
  title: string
  description: string
  days: ItineraryDay[]
  totalCost: number
  totalDuration: number // in days
  travelerCount: number
  travelerType: TravelerType
  createdAt: string
  updatedAt: string
}

export interface ItineraryDay {
  day: number
  date: string
  items: ItineraryItem[]
  totalCost: number
  notes?: string
}

// --- TIPE DATA YANG HILANG ADA DI SINI ---

export interface TravelQueryRequest {
  query: string;
  destination?: string;
  duration?: number;
  budget?: number;
  traveler_count?: number;
  traveler_type?: TravelerType;
  interests?: string[];
  start_date?: string;
}

export interface ItineraryGenerationRequest {
  destination: string;
  duration: number;
  budget: number;
  traveler_count: number;
  traveler_type: TravelerType;
  interests: string[];
  activity_level: ActivityLevel;
  start_date?: string;
}

export interface ParsedTravelQuery {
  destination?: string;
  duration?: number;
  budget?: number;
  traveler_count?: number;
  traveler_type?: TravelerType;
  interests: string[];
  activity_level?: ActivityLevel;
  start_date?: string;
  extracted_keywords: string[];
  confidence: number;
}

// --- BATAS AKHIR TIPE DATA YANG HILANG ---


export interface TravelPreferences {
  accommodationType: AccommodationType[]
  transportationType: TransportationType[]
  activityLevel: ActivityLevel
  foodPreferences: FoodPreference[]
  budgetDistribution: BudgetDistribution
}

export interface BudgetDistribution {
  accommodation: number // percentage
  food: number // percentage
  transportation: number // percentage
  activities: number // percentage
  shopping: number // percentage
}

export interface Transportation {
  type: TransportationType
  duration: number // in minutes
  cost: number
  description: string
}

export interface SentimentAnalysis {
  overall: number // -1 to 1
  positive: number
  negative: number
  neutral: number
  confidence?: number // 0 to 1
  keywords: string[]
  lastUpdated: string
}

export interface OpeningHours {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

export interface TimeSlot {
  open: string // HH:mm format
  close: string // HH:mm format
}

// Enums
export enum DestinationCategory {
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  CULTURAL = 'cultural',
  HISTORICAL = 'historical',
  CULINARY = 'culinary',
  ADVENTURE = 'adventure',
  RELIGIOUS = 'religious',
  SHOPPING = 'shopping',
  NIGHTLIFE = 'nightlife',
  NATURE = 'nature',
  URBAN = 'urban'
}

export enum TravelerType {
  SOLO = 'solo',
  COUPLE = 'couple',
  FAMILY = 'family',
  FRIENDS = 'friends',
  BUSINESS = 'business'
}

export enum AccommodationType {
  HOTEL = 'hotel',
  RESORT = 'resort',
  HOMESTAY = 'homestay',
  HOSTEL = 'hostel',
  VILLA = 'villa',
  APARTMENT = 'apartment'
}

export enum TransportationType {
  FLIGHT = 'flight',
  TRAIN = 'train',
  BUS = 'bus',
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  BOAT = 'boat',
  WALKING = 'walking'
}

export enum ActivityLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high'
}

export enum FoodPreference {
  LOCAL = 'local',
  INTERNATIONAL = 'international',
  VEGETARIAN = 'vegetarian',
  HALAL = 'halal',
  STREET_FOOD = 'street_food',
  FINE_DINING = 'fine_dining'
}

export enum PriceRange {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  EXPENSIVE = 'expensive',
  LUXURY = 'luxury'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ItineraryGenerationResponse {
  itinerary: Itinerary;
  ai_reasoning: string;
  confidence_score: number;
  alternative_suggestions: string[];
}

export interface DestinationSearchResponse {
  destinations: Destination[];
  total: number;
  query: string;
  filters_applied: any;
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}