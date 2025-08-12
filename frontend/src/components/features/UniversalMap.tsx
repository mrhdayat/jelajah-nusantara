'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Location {
  lat: number
  lng: number
  name: string
  description?: string
}

interface UniversalMapProps {
  locations: Location[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  className?: string
}

export default function UniversalMap({
  locations,
  center = { lat: -6.2088, lng: 106.8456 }, // Jakarta default
  zoom = 10,
  height = '400px',
  className = ''
}: UniversalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapProvider, setMapProvider] = useState<string>('openstreetmap')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Determine which map provider to use
    const provider = process.env.NEXT_PUBLIC_MAPS_PROVIDER || 'openstreetmap'
    setMapProvider(provider)
    
    if (provider === 'mapbox') {
      loadMapboxMap()
    } else if (provider === 'google') {
      loadGoogleMap()
    } else {
      loadOpenStreetMap()
    }
  }, [locations, center, zoom])

  const loadOpenStreetMap = async () => {
    try {
      setIsLoading(true)
      
      // Load Leaflet dynamically
      const L = await import('leaflet')

      // Load Leaflet CSS dynamically
      if (typeof window !== 'undefined') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      
      if (!mapRef.current) return

      // Clear existing map
      mapRef.current.innerHTML = ''

      // Create map
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Add markers
      locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map)
        
        if (location.description) {
          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${location.name}</h3>
              <p class="text-sm text-gray-600">${location.description}</p>
            </div>
          `)
        }
      })

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const group = new L.FeatureGroup(
          locations.map(loc => L.marker([loc.lat, loc.lng]))
        )
        map.fitBounds(group.getBounds().pad(0.1))
      }

      setIsLoading(false)
    } catch (err) {
      setError('Failed to load OpenStreetMap')
      setIsLoading(false)
    }
  }

  const loadMapboxMap = async () => {
    try {
      setIsLoading(true)
      
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!mapboxToken || mapboxToken.includes('demo_mapbox_token')) {
        throw new Error('Mapbox token not configured')
      }

      // Load Mapbox GL JS dynamically
      const mapboxgl = await import('mapbox-gl')

      // Load Mapbox CSS dynamically
      if (typeof window !== 'undefined') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
        document.head.appendChild(link)
      }
      
      mapboxgl.default.accessToken = mapboxToken

      if (!mapRef.current) return

      // Clear existing map
      mapRef.current.innerHTML = ''

      // Create map
      const map = new mapboxgl.default.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [center.lng, center.lat],
        zoom: zoom
      })

      // Add markers
      locations.forEach(location => {
        // Create marker element
        const el = document.createElement('div')
        el.className = 'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg'

        // Add marker to map
        const marker = new mapboxgl.default.Marker(el)
          .setLngLat([location.lng, location.lat])
          .addTo(map)

        // Add popup
        if (location.description) {
          const popup = new mapboxgl.default.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.description}</p>
              </div>
            `)
          
          marker.setPopup(popup)
        }
      })

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const bounds = new mapboxgl.LngLatBounds()
        locations.forEach(loc => bounds.extend([loc.lng, loc.lat]))
        map.fitBounds(bounds, { padding: 50 })
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Mapbox error:', err)
      setError('Failed to load Mapbox. Falling back to OpenStreetMap...')
      // Fallback to OpenStreetMap
      setTimeout(() => {
        setMapProvider('openstreetmap')
        loadOpenStreetMap()
      }, 1000)
    }
  }

  const loadGoogleMap = async () => {
    try {
      setIsLoading(true)
      
      const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!googleMapsKey || googleMapsKey.includes('demo_google_maps')) {
        throw new Error('Google Maps API key not configured')
      }

      // Load Google Maps API
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      if (!mapRef.current) return

      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: 'roadmap'
      })

      // Add markers
      const markers = locations.map(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name
        })

        if (location.description) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.description}</p>
              </div>
            `
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
        }

        return marker
      })

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const bounds = new window.google.maps.LatLngBounds()
        locations.forEach(loc => bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng)))
        map.fitBounds(bounds)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Google Maps error:', err)
      setError('Failed to load Google Maps. Falling back to OpenStreetMap...')
      // Fallback to OpenStreetMap
      setTimeout(() => {
        setMapProvider('openstreetmap')
        loadOpenStreetMap()
      }, 1000)
    }
  }

  const getProviderInfo = () => {
    switch (mapProvider) {
      case 'mapbox':
        return { name: 'Mapbox', icon: Zap, color: 'text-blue-500' }
      case 'google':
        return { name: 'Google Maps', icon: Navigation, color: 'text-green-500' }
      default:
        return { name: 'OpenStreetMap', icon: MapPin, color: 'text-orange-500' }
    }
  }

  const providerInfo = getProviderInfo()

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <providerInfo.icon className={`w-5 h-5 ${providerInfo.color}`} />
          Peta Interaktif
          <span className="text-sm font-normal text-gray-500">
            ({providerInfo.name})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}
        
        <div className="relative">
          {isLoading && (
            <div 
              className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10"
              style={{ height }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading {providerInfo.name}...</p>
              </div>
            </div>
          )}
          
          <div
            ref={mapRef}
            style={{ height }}
            className="w-full rounded-lg overflow-hidden border border-gray-200"
          />
        </div>

        {locations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Lokasi ({locations.length})
            </h4>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{location.name}</span>
                  {location.description && (
                    <span className="text-gray-500">- {location.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
