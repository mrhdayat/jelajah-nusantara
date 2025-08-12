'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Heart, 
  Clock,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Star,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ParsedTravelQuery } from '@/types'

interface QueryResultDisplayProps {
  parsedQuery: ParsedTravelQuery
  onGenerateItinerary?: () => void
  onEditQuery?: () => void
  className?: string
}

export default function QueryResultDisplay({
  parsedQuery,
  onGenerateItinerary,
  onEditQuery,
  className = ''
}: QueryResultDisplayProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200'
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Sangat Akurat'
    if (confidence >= 0.6) return 'Cukup Akurat'
    if (confidence >= 0.4) return 'Perlu Konfirmasi'
    return 'Kurang Akurat'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTravelerTypeIcon = (type: string) => {
    switch (type) {
      case 'solo': return '🧳'
      case 'couple': return '💑'
      case 'family': return '👨‍👩‍👧‍👦'
      case 'friends': return '👥'
      case 'business': return '💼'
      default: return '🧳'
    }
  }

  const getTravelerTypeText = (type: string) => {
    switch (type) {
      case 'solo': return 'Solo Traveler'
      case 'couple': return 'Pasangan'
      case 'family': return 'Keluarga'
      case 'friends': return 'Teman-teman'
      case 'business': return 'Bisnis'
      default: return 'Tidak Diketahui'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header dengan Confidence Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">Hasil Analisis AI</h2>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getConfidenceColor(parsedQuery.confidence)}`}>
          <Target className="w-5 h-5" />
          <span className="font-semibold">
            {getConfidenceText(parsedQuery.confidence)} ({(parsedQuery.confidence * 100).toFixed(0)}%)
          </span>
        </div>
      </motion.div>

      {/* Main Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Destination Card */}
        {parsedQuery.destination && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <MapPin className="w-5 h-5" />
                  Destinasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800 mb-2">
                  {parsedQuery.destination}
                </div>
                <div className="text-sm text-blue-600">
                  Lokasi tujuan perjalanan
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Duration Card */}
        {parsedQuery.duration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Calendar className="w-5 h-5" />
                  Durasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800 mb-2">
                  {parsedQuery.duration} Hari
                </div>
                <div className="text-sm text-green-600">
                  Lama perjalanan
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Budget Card */}
        {parsedQuery.budget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <DollarSign className="w-5 h-5" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800 mb-2">
                  {formatCurrency(parsedQuery.budget)}
                </div>
                <div className="text-sm text-purple-600">
                  Anggaran perjalanan
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Traveler Info Card */}
        {(parsedQuery.traveler_count || parsedQuery.traveler_type) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Users className="w-5 h-5" />
                  Wisatawan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {getTravelerTypeIcon(parsedQuery.traveler_type || 'solo')}
                  </span>
                  <div>
                    <div className="text-lg font-bold text-orange-800">
                      {parsedQuery.traveler_count || 1} Orang
                    </div>
                    <div className="text-sm text-orange-600">
                      {getTravelerTypeText(parsedQuery.traveler_type || 'solo')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Activity Level Card */}
        {parsedQuery.activity_level && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-pink-700">
                  <TrendingUp className="w-5 h-5" />
                  Aktivitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-800 mb-2 capitalize">
                  {parsedQuery.activity_level}
                </div>
                <div className="text-sm text-pink-600">
                  Level aktivitas
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Interests Section */}
      {parsedQuery.interests && parsedQuery.interests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Heart className="w-5 h-5" />
                Minat & Preferensi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {parsedQuery.interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="px-4 py-2 bg-white border-2 border-indigo-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-indigo-700 font-medium capitalize">
                      {interest}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Keywords Section */}
      {parsedQuery.extracted_keywords && parsedQuery.extracted_keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-5 h-5" />
                Kata Kunci yang Terdeteksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsedQuery.extracted_keywords.map((keyword, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onGenerateItinerary}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Buat Itinerary Lengkap
        </Button>
        
        <Button
          onClick={onEditQuery}
          variant="outline"
          size="lg"
          className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        >
          <Clock className="w-5 h-5 mr-2" />
          Edit Query
        </Button>
      </motion.div>

      {/* AI Confidence Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Star className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            AI telah menganalisis permintaan Anda dengan tingkat kepercayaan {(parsedQuery.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </motion.div>
    </div>
  )
}
