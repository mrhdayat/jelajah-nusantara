'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  RefreshCw,
  ChevronRight,
  Star,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ParsedTravelQuery, Destination } from '@/types'
import { getAIRecommendations } from '@/lib/api'
import { LoadingCard } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'
import DestinationCard from './DestinationCard'

interface RecommendationItem {
  name: string
  location: string
  category: string
  match_score: number
  reasons: string[]
  best_time: string
  estimated_cost: string
  highlights: string[]
}

interface AIRecommendationsProps {
  parsedQuery: ParsedTravelQuery
  onDestinationSelect?: (destination: any) => void
  className?: string
}



export default function AIRecommendations({
  parsedQuery,
  onDestinationSelect,
  className = ''
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [reasoning, setReasoning] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (parsedQuery) {
      generateRecommendations()
    }
  }, [parsedQuery])

  const generateRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getAIRecommendations(parsedQuery)

      if (result.success && result.data) {
        setRecommendations(result.data.recommendations || [])
        setReasoning(result.data.reasoning || '')
      } else {
        setError(result.message || 'Gagal mendapatkan rekomendasi')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendapatkan rekomendasi')
      console.error('Recommendations error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['all', ...new Set(recommendations.map(r => r.category))]
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory)

  if (isLoading) {
    return (
      <LoadingCard
        title="Menganalisis Preferensi Anda..."
        description="AI sedang mencari destinasi terbaik berdasarkan keinginan Anda"
        className={className}
      />
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <ErrorMessage
            title="Gagal Mendapatkan Rekomendasi"
            message={error}
            onRetry={generateRecommendations}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Rekomendasi AI untuk Anda
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Perbarui
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada rekomendasi tersedia</p>
            <p className="text-sm mt-2">Coba perbarui untuk mendapatkan rekomendasi baru</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Reasoning */}
            {reasoning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Analisis AI
                </h4>
                <p className="text-purple-700 text-sm leading-relaxed">{reasoning}</p>
              </motion.div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'Semua' : category}
                </Button>
              ))}
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={`${recommendation.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecommendationCard
                      recommendation={recommendation}
                      onSelect={() => onDestinationSelect?.(recommendation)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Query Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-semibold text-gray-800 mb-3">Berdasarkan Preferensi Anda:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {parsedQuery.destination && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{parsedQuery.destination}</span>
                  </div>
                )}
                {parsedQuery.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{parsedQuery.duration} hari</span>
                  </div>
                )}
                {parsedQuery.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <span>Rp {parsedQuery.budget.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {parsedQuery.traveler_type && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span className="capitalize">{parsedQuery.traveler_type}</span>
                  </div>
                )}
              </div>
              {parsedQuery.interests && parsedQuery.interests.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">Minat: </span>
                  <span className="text-sm text-gray-600">
                    {parsedQuery.interests.join(', ')}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface RecommendationCardProps {
  recommendation: RecommendationItem
  onSelect?: () => void
}

function RecommendationCard({ recommendation, onSelect }: RecommendationCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  // Helper functions for match score (moved inside component)
  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-blue-600 bg-blue-50'
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Sangat Cocok'
    if (score >= 0.6) return 'Cocok'
    if (score >= 0.4) return 'Cukup Cocok'
    return 'Kurang Cocok'
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={onSelect}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {recommendation.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{recommendation.location}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                {recommendation.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(recommendation.match_score)}`}>
              {getMatchScoreLabel(recommendation.match_score)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setIsFavorited(!isFavorited)
              }}
              className={isFavorited ? 'text-red-500' : 'text-gray-400'}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Mengapa Cocok untuk Anda:</h4>
          <ul className="space-y-1">
            {recommendation.reasons.slice(0, 3).map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Highlights */}
        {recommendation.highlights && recommendation.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Highlights:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.highlights.slice(0, 4).map((highlight, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recommendation.best_time}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {recommendation.estimated_cost}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{(recommendation.match_score * 5).toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}