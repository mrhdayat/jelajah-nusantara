'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Share,
  Download,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Itinerary, ItineraryDay } from '@/types'
import { formatCurrency, formatDate, formatDuration } from '@/lib/utils'
import DestinationCard from './DestinationCard'

interface ItineraryDisplayProps {
  itinerary: Itinerary
  onEdit?: (itinerary: Itinerary) => void
  onShare?: (itinerary: Itinerary) => void
  onDownload?: (itinerary: Itinerary) => void
  className?: string
}

export default function ItineraryDisplay({
  itinerary,
  onEdit,
  onShare,
  onDownload,
  className = ''
}: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))

  const toggleDay = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber)
    } else {
      newExpanded.add(dayNumber)
    }
    setExpandedDays(newExpanded)
  }

  const expandAllDays = () => {
    setExpandedDays(new Set(itinerary.days.map(day => day.day)))
  }

  const collapseAllDays = () => {
    setExpandedDays(new Set())
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Itinerary Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{itinerary.title}</CardTitle>
              <p className="text-blue-100 mb-4">{itinerary.description}</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Durasi</div>
                    <div className="font-semibold">{formatDuration(itinerary.totalDuration)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Wisatawan</div>
                    <div className="font-semibold">{itinerary.travelerCount} orang</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Total Budget</div>
                    <div className="font-semibold">{formatCurrency(itinerary.totalCost)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-200" />
                  <div>
                    <div className="text-sm text-blue-200">Tipe</div>
                    <div className="font-semibold capitalize">{itinerary.travelerType}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => onEdit?.(itinerary)}
              >
                <Edit className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => onShare?.(itinerary)}
              >
                <Share className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => onDownload?.(itinerary)}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Jadwal Perjalanan</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAllDays}>
            Buka Semua
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAllDays}>
            Tutup Semua
          </Button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {itinerary.days.map((day, index) => (
          <DayCard
            key={day.day}
            day={day}
            isExpanded={expandedDays.has(day.day)}
            onToggle={() => toggleDay(day.day)}
            isLast={index === itinerary.days.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

interface DayCardProps {
  day: ItineraryDay
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
}

function DayCard({ day, isExpanded, onToggle, isLast }: DayCardProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-blue-500">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-semibold">
              {day.day}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Hari {day.day}</h3>
              <p className="text-gray-600">{formatDate(day.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">{day.items.length} aktivitas</div>
              <div className="font-semibold text-blue-600">{formatCurrency(day.totalCost)}</div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              {day.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">{day.notes}</p>
                </div>
              )}

              <div className="space-y-4">
                {day.items.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline connector */}
                    {index < day.items.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200" />
                    )}
                    
                    <div className="flex gap-4">
                      {/* Time indicator */}
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1" />
                        <div className="text-xs text-gray-500 font-medium">
                          {item.startTime}
                        </div>
                      </div>

                      {/* Activity content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {item.destination.name}
                              </h4>
                              <div className="flex items-center text-gray-600 text-sm mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{item.destination.location.address}</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-sm text-gray-500">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {item.duration} menit
                              </div>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(item.estimatedCost)}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {item.destination.description}
                          </p>

                          {item.notes && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3">
                              <p className="text-yellow-800 text-sm">{item.notes}</p>
                            </div>
                          )}

                          {/* Transportation to next */}
                          {item.transportationToNext && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Ke lokasi berikutnya: {item.transportationToNext.type}</span>
                                <span>{item.transportationToNext.duration} menit • {formatCurrency(item.transportationToNext.cost)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
