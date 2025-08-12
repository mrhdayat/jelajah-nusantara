'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Destination, ItineraryItem } from '@/types'

// Type declarations for Google Maps (fallback if @types/google.maps not available)
declare global {
  interface Window {
    google: any;
  }
}

// Google Maps types (simplified)
type GoogleMap = any;
type GoogleMarker = any;
type GoogleDirectionsRenderer = any;

// Definisikan tipe data untuk lokasi
interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  content: string;
  icon?: any;
  label?: string;
}


interface InteractiveMapProps {
  destinations?: Destination[]
  itineraryItems?: ItineraryItem[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  onDestinationClick?: (destination: Destination) => void
  onMapClick?: (location: { lat: number; lng: number }) => void
  showRoute?: boolean
  className?: string
}

export default function InteractiveMap({
  destinations = [],
  itineraryItems = [],
  center = { lat: -6.2088, lng: 106.8456 }, // Jakarta default
  zoom = 10,
  height = '400px',
  onDestinationClick,
  onMapClick,
  showRoute = false,
  className = ''
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<GoogleMap | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [markers, setMarkers] = useState<GoogleMarker[]>([])
  const [directionsRenderer, setDirectionsRenderer] = useState<GoogleDirectionsRenderer | null>(null)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap')

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY
      if (!apiKey) {
        console.error('Google Maps API key not found')
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        })

        await loader.load()

        if (mapRef.current) {
          const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeId: mapType,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false
          })

          setMap(mapInstance)
          setIsLoaded(true)

          // Add click listener
          if (onMapClick) {
            mapInstance.addListener('click', (e: any) => {
              if (e.latLng) {
                onMapClick({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                })
              }
            })
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [center.lat, center.lng, zoom, mapType, onMapClick])

  // Update markers when destinations change
  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    setMarkers([])

    const newMarkers: any[] = []

    // Add destination markers
    destinations.forEach((destination, index) => {
      const marker = new (window as any).google.maps.Marker({
        position: {
          lat: destination.location.latitude,
          lng: destination.location.longitude
        },
        map,
        title: destination.name,
        icon: {
          url: getMarkerIcon(destination.category),
          scaledSize: new (window as any).google.maps.Size(40, 40),
          anchor: new (window as any).google.maps.Point(20, 40)
        }
      })

      // Add info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: createInfoWindowContent(destination)
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        onDestinationClick?.(destination)
      })

      newMarkers.push(marker)
    })

    // Add itinerary item markers with numbers
    itineraryItems.forEach((item, index) => {
      const marker = new (window as any).google.maps.Marker({
        position: {
          lat: item.destination.location.latitude,
          lng: item.destination.location.longitude
        },
        map,
        title: `${index + 1}. ${item.destination.name}`,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(40, 40),
          anchor: new (window as any).google.maps.Point(20, 20)
        }
      })

      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: createItineraryInfoWindowContent(item, index + 1)
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new (window as any).google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      map.fitBounds(bounds)
    }
  }, [map, isLoaded, destinations, itineraryItems, onDestinationClick])

  // Draw route for itinerary items
  useEffect(() => {
    if (!map || !isLoaded || !showRoute || itineraryItems.length < 2) {
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }
      return
    }

    const directionsService = new (window as any).google.maps.DirectionsService()
    const renderer = new (window as any).google.maps.DirectionsRenderer({
      suppressMarkers: true, // We'll use our own markers
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    })

    renderer.setMap(map)
    setDirectionsRenderer(renderer)

    // Create waypoints
    const waypoints = itineraryItems.slice(1, -1).map(item => ({
      location: {
        lat: item.destination.location.latitude,
        lng: item.destination.location.longitude
      },
      stopover: true
    }))

    const request: any = {
      origin: {
        lat: itineraryItems[0].destination.location.latitude,
        lng: itineraryItems[0].destination.location.longitude
      },
      destination: {
        lat: itineraryItems[itineraryItems.length - 1].destination.location.latitude,
        lng: itineraryItems[itineraryItems.length - 1].destination.location.longitude
      },
      waypoints,
      travelMode: (window as any).google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK' && result) {
        renderer.setDirections(result)
      }
    })

    return () => {
      renderer.setMap(null)
    }
  }, [map, isLoaded, showRoute, itineraryItems])

  const getMarkerIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      beach: '🏖️',
      mountain: '🏔️',
      cultural: '🏛️',
      historical: '🏺',
      culinary: '🍽️',
      adventure: '🎯',
      religious: '🕌',
      shopping: '🛍️',
      nightlife: '🌃',
      nature: '🌿',
      urban: '🏙️'
    }

    const emoji = iconMap[category] || '📍'
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="30" r="8" fill="white" stroke="#333" stroke-width="2"/>
        <text x="20" y="35" text-anchor="middle" font-size="12">${emoji}</text>
        <path d="M20 5 L25 15 L15 15 Z" fill="#FF6B6B" stroke="white" stroke-width="2"/>
      </svg>
    `)}`
  }

  const createInfoWindowContent = (destination: Destination): string => {
    return `
      <div style="max-width: 250px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${destination.name}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${destination.location.address}</p>
        <p style="margin: 0 0 8px 0; font-size: 12px;">${destination.description}</p>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
          <span>⭐ ${destination.rating.toFixed(1)}</span>
          <span>💰 ${destination.priceRange}</span>
        </div>
      </div>
    `
  }

  const createItineraryInfoWindowContent = (item: ItineraryItem, order: number): string => {
    return `
      <div style="max-width: 250px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${order}. ${item.destination.name}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${item.startTime} - ${item.endTime}</p>
        <p style="margin: 0 0 8px 0; font-size: 12px;">${item.destination.description}</p>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
          <span>⏱️ ${item.duration} menit</span>
          <span>💰 Rp ${item.estimatedCost.toLocaleString('id-ID')}</span>
        </div>
        ${item.notes ? `<p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic; color: #888;">${item.notes}</p>` : ''}
      </div>
    `
  }

  const handleZoomIn = useCallback(() => {
    if (map) {
      map.setZoom((map.getZoom() || 10) + 1)
    }
  }, [map])

  const handleZoomOut = useCallback(() => {
    if (map) {
      map.setZoom((map.getZoom() || 10) - 1)
    }
  }, [map])

  const handleResetView = useCallback(() => {
    if (map) {
      if (markers.length > 0) {
        const bounds = new (window as any).google.maps.LatLngBounds()
        markers.forEach(marker => {
          const position = marker.getPosition()
          if (position) bounds.extend(position)
        })
        map.fitBounds(bounds)
      } else {
        map.setCenter(center)
        map.setZoom(zoom)
      }
    }
  }, [map, markers, center, zoom])

  const toggleMapType = useCallback(() => {
    const types: Array<'roadmap' | 'satellite' | 'hybrid' | 'terrain'> = ['roadmap', 'satellite', 'hybrid', 'terrain']
    const currentIndex = types.indexOf(mapType)
    const nextType = types[(currentIndex + 1) % types.length]
    setMapType(nextType)
    if (map) {
      map.setMapTypeId(nextType)
    }
  }, [map, mapType])

  if (!process.env.NEXT_PUBLIC_Maps_API_KEY) {
    return (
      <Card className={`p-8 text-center ${className}`} style={{ height }}>
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Google Maps API key tidak ditemukan</p>
        <p className="text-sm text-gray-500 mt-2">
          Silakan tambahkan NEXT_PUBLIC_Maps_API_KEY ke file environment
        </p>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${className}`}
    >
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg overflow-hidden shadow-lg"
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={handleResetView}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm"
          onClick={toggleMapType}
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat peta...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}