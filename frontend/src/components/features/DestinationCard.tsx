'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, DollarSign, Clock, Users, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Destination } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

interface DestinationCardProps {
  destination: Destination
  onSelect?: (destination: Destination) => void
  onFavorite?: (destination: Destination) => void
  isFavorited?: boolean
  showActions?: boolean
  className?: string
}

export default function DestinationCard({
  destination,
  onSelect,
  onFavorite,
  isFavorited = false,
  showActions = true,
  className = ''
}: DestinationCardProps) {
  const handleSelect = () => {
    onSelect?.(destination)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite?.(destination)
  }

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-blue-600 bg-blue-50'
      case 'expensive': return 'text-orange-600 bg-orange-50'
      case 'luxury': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return 'Budget'
      case 'moderate': return 'Moderate'
      case 'expensive': return 'Mahal'
      case 'luxury': return 'Luxury'
      default: return 'Unknown'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beach': return 'text-blue-600 bg-blue-50'
      case 'mountain': return 'text-green-600 bg-green-50'
      case 'cultural': return 'text-purple-600 bg-purple-50'
      case 'historical': return 'text-amber-600 bg-amber-50'
      case 'culinary': return 'text-red-600 bg-red-50'
      case 'adventure': return 'text-orange-600 bg-orange-50'
      case 'religious': return 'text-indigo-600 bg-indigo-50'
      case 'shopping': return 'text-pink-600 bg-pink-50'
      case 'nightlife': return 'text-violet-600 bg-violet-50'
      case 'nature': return 'text-emerald-600 bg-emerald-50'
      case 'urban': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm"
        onClick={handleSelect}
      >
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          {destination.images && destination.images.length > 0 ? (
            <Image
              src={destination.images[0]}
              alt={destination.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white/70" />
            </div>
          )}
          
          {/* Overlay with favorite button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 ${
                isFavorited 
                  ? 'text-red-500 bg-white/90 hover:bg-white' 
                  : 'text-white bg-black/20 hover:bg-black/40'
              }`}
              onClick={handleFavorite}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(destination.category)}`}>
              {destination.category}
            </span>
          </div>

          {/* Price Range Badge */}
          <div className="absolute bottom-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceRangeColor(destination.priceRange)}`}>
              {getPriceRangeText(destination.priceRange)}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
              {destination.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{destination.location.city}, {destination.location.province}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {destination.description}
          </p>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-gray-700">
                {destination.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({destination.reviewCount} ulasan)
              </span>
            </div>
          </div>

          {/* Tags */}
          {destination.tags && destination.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {destination.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {destination.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{destination.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Facilities */}
          {destination.facilities && destination.facilities.length > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              <span className="font-medium">Fasilitas: </span>
              {destination.facilities.slice(0, 3).join(', ')}
              {destination.facilities.length > 3 && ` +${destination.facilities.length - 3} lainnya`}
            </div>
          )}

          {/* Action Button */}
          {showActions && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                handleSelect()
              }}
            >
              Lihat Detail
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
