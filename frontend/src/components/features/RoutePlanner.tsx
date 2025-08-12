'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  GripVertical,
  Plus,
  Trash2,
  Route,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Destination } from '@/types'
import { optimizeRoute } from '@/lib/api'
import InteractiveMap from './InteractiveMap'
import DestinationCard from './DestinationCard'
import toast from 'react-hot-toast'

interface RouteItem {
  id: string
  destination: Destination
  order: number
}

interface RoutePlannerProps {
  initialDestinations?: Destination[]
  onRouteOptimized?: (optimizedRoute: RouteItem[]) => void
  className?: string
}

export default function RoutePlanner({
  initialDestinations = [],
  onRouteOptimized,
  className = ''
}: RoutePlannerProps) {
  const [routeItems, setRouteItems] = useState<RouteItem[]>([])
  const [startLocation, setStartLocation] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [routeInfo, setRouteInfo] = useState<any>(null)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  // Initialize route items from initial destinations
  useEffect(() => {
    if (initialDestinations.length > 0) {
      const items = initialDestinations.map((dest, index) => ({
        id: dest.id,
        destination: dest,
        order: index
      }))
      setRouteItems(items)
    }
  }, [initialDestinations])

  const handleReorder = (newOrder: RouteItem[]) => {
    const reorderedItems = newOrder.map((item, index) => ({
      ...item,
      order: index
    }))
    setRouteItems(reorderedItems)
  }

  const addDestination = (destination: Destination) => {
    const newItem: RouteItem = {
      id: destination.id,
      destination,
      order: routeItems.length
    }
    setRouteItems([...routeItems, newItem])
  }

  const removeDestination = (id: string) => {
    const filtered = routeItems.filter(item => item.id !== id)
    const reordered = filtered.map((item, index) => ({
      ...item,
      order: index
    }))
    setRouteItems(reordered)
  }

  const optimizeRouteOrder = async () => {
    if (routeItems.length < 2) {
      toast.error('Minimal 2 destinasi diperlukan untuk optimasi rute')
      return
    }

    if (!startLocation.trim()) {
      toast.error('Silakan masukkan titik awal perjalanan')
      return
    }

    setIsOptimizing(true)

    try {
      const destinationIds = routeItems.map(item => item.destination.id)
      const preferences = {
        optimize_for: 'time', // or 'distance', 'cost'
        avoid_tolls: false,
        avoid_highways: false
      }

      const result = await optimizeRoute(destinationIds, startLocation, preferences)

      if (result.success && result.data) {
        // Reorder route items based on optimization result
        const optimizedOrder = result.data.optimized_route
        const reorderedItems = optimizedOrder.map((destId: string, index: number) => {
          const item = routeItems.find(item => item.destination.id === destId)
          return item ? { ...item, order: index } : null
        }).filter(Boolean) as RouteItem[]

        setRouteItems(reorderedItems)
        setRouteInfo(result.data)
        onRouteOptimized?.(reorderedItems)
        toast.success('Rute berhasil dioptimasi!')
      } else {
        toast.error('Gagal mengoptimasi rute')
      }
    } catch (error) {
      console.error('Error optimizing route:', error)
      toast.error('Terjadi kesalahan saat mengoptimasi rute')
    } finally {
      setIsOptimizing(false)
    }
  }

  const calculateTotalDistance = () => {
    if (!routeInfo?.route_details) return 0
    return routeInfo.route_details.reduce((total: number, segment: any) => 
      total + segment.distance_km, 0
    )
  }

  const calculateTotalTime = () => {
    if (!routeInfo?.route_details) return 0
    return routeInfo.route_details.reduce((total: number, segment: any) => 
      total + segment.travel_time_minutes, 0
    )
  }

  const calculateTotalCost = () => {
    if (!routeInfo?.route_details) return 0
    return routeInfo.route_details.reduce((total: number, segment: any) => 
      total + segment.cost_estimate, 0
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-6 h-6 text-blue-500" />
            Perencanaan Rute Perjalanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titik Awal Perjalanan
              </label>
              <Input
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="Contoh: Hotel Mulia, Jakarta"
                className="w-full"
              />
            </div>
            <Button
              onClick={optimizeRouteOrder}
              disabled={isOptimizing || routeItems.length < 2}
              variant="gradient"
              className="min-w-48"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Mengoptimasi...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimasi Rute
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Route List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daftar Destinasi ({routeItems.length})</span>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Destinasi
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {routeItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada destinasi yang dipilih</p>
                <p className="text-sm">Tambahkan destinasi untuk mulai merencanakan rute</p>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={routeItems}
                onReorder={handleReorder}
                className="space-y-3"
              >
                {routeItems.map((item, index) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <motion.div
                      layout
                      className="bg-gray-50 rounded-lg p-4 border-2 border-transparent hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {item.destination.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {item.destination.location.city}, {item.destination.location.province}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDestination(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Route segment info */}
                      {routeInfo?.route_details?.[index] && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-4 h-4" />
                                {routeInfo.route_details[index].distance_km} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {routeInfo.route_details[index].travel_time_minutes} menit
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Rp {routeInfo.route_details[index].cost_estimate.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}

            {/* Route Summary */}
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <h4 className="font-semibold text-blue-800 mb-3">Ringkasan Rute</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold">
                      {calculateTotalDistance().toFixed(1)} km
                    </div>
                    <div className="text-blue-500">Total Jarak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold">
                      {Math.round(calculateTotalTime())} menit
                    </div>
                    <div className="text-blue-500">Total Waktu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold">
                      Rp {calculateTotalCost().toLocaleString('id-ID')}
                    </div>
                    <div className="text-blue-500">Biaya Transport</div>
                  </div>
                </div>
                
                {routeInfo.optimization_score && (
                  <div className="mt-3 text-center">
                    <div className="text-sm text-blue-600">
                      Skor Optimasi: {(routeInfo.optimization_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Visualisasi Rute</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InteractiveMap
              destinations={routeItems.map(item => item.destination)}
              showRoute={routeItems.length > 1}
              height="500px"
              onDestinationClick={setSelectedDestination}
              className="rounded-b-lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected Destination Detail */}
      {selectedDestination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detail Destinasi</CardTitle>
            </CardHeader>
            <CardContent>
              <DestinationCard
                destination={selectedDestination}
                showActions={false}
                className="max-w-md"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
