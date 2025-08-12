'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Destination, SentimentAnalysis as SentimentType } from '@/types'
import { analyzeDestinationSentiment } from '@/lib/api'
import { LoadingSpinner } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'

interface SentimentAnalysisProps {
  destination: Destination
  className?: string
}

export default function SentimentAnalysis({ destination, className = '' }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<SentimentType | null>(destination.sentiment || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!sentiment) {
      analyzeSentiment()
    }
  }, [destination.id])

  const analyzeSentiment = async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await analyzeDestinationSentiment(destination.id, forceRefresh)
      
      if (result.success && result.data) {
        setSentiment(result.data)
        setLastUpdated(new Date())
      } else {
        setError(result.message || 'Gagal menganalisis sentimen')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menganalisis sentimen')
      console.error('Sentiment analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600'
    if (score < -0.3) return 'text-red-600'
    return 'text-yellow-600'
  }

  const getSentimentBgColor = (score: number) => {
    if (score > 0.3) return 'bg-green-50 border-green-200'
    if (score < -0.3) return 'bg-red-50 border-red-200'
    return 'bg-yellow-50 border-yellow-200'
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <TrendingUp className="w-5 h-5" />
    if (score < -0.3) return <TrendingDown className="w-5 h-5" />
    return <Minus className="w-5 h-5" />
  }

  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return 'Sangat Positif'
    if (score > 0.3) return 'Positif'
    if (score > 0.1) return 'Cukup Positif'
    if (score > -0.1) return 'Netral'
    if (score > -0.3) return 'Cukup Negatif'
    if (score > -0.5) return 'Negatif'
    return 'Sangat Negatif'
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <ErrorMessage
            title="Analisis Sentimen Gagal"
            message={error}
            onRetry={() => analyzeSentiment()}
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
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Analisis Sentimen Ulasan
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => analyzeSentiment(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Menganalisis...' : 'Perbarui'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !sentiment ? (
          <div className="text-center py-8">
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-gray-600">Menganalisis sentimen ulasan...</p>
            <p className="text-sm text-gray-500 mt-2">
              Ini mungkin memerlukan beberapa saat
            </p>
          </div>
        ) : sentiment ? (
          <div className="space-y-6">
            {/* Overall Sentiment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${getSentimentBgColor(sentiment.overall)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={getSentimentColor(sentiment.overall)}>
                    {getSentimentIcon(sentiment.overall)}
                  </span>
                  <span className="font-semibold text-gray-800">
                    Sentimen Keseluruhan
                  </span>
                </div>
                <span className={`font-bold text-lg ${getSentimentColor(sentiment.overall)}`}>
                  {getSentimentLabel(sentiment.overall)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Skor: {sentiment.overall.toFixed(2)} (dari -1 hingga +1)
              </div>
            </motion.div>

            {/* Sentiment Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(sentiment.positive)}
                </div>
                <div className="text-sm text-green-700">Positif</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <Minus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-600">
                  {formatPercentage(sentiment.neutral)}
                </div>
                <div className="text-sm text-gray-700">Netral</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <ThumbsDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {formatPercentage(sentiment.negative)}
                </div>
                <div className="text-sm text-red-700">Negatif</div>
              </motion.div>
            </div>

            {/* Keywords */}
            {sentiment.keywords && sentiment.keywords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-semibold text-gray-800 mb-3">Kata Kunci Populer</h4>
                <div className="flex flex-wrap gap-2">
                  {sentiment.keywords.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Confidence and Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Tingkat Kepercayaan:</span>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(sentiment.confidence || 0) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold">
                        {formatPercentage(sentiment.confidence || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {lastUpdated && (
                  <div>
                    <span className="font-medium">Terakhir Diperbarui:</span>
                    <div className="mt-1">
                      {lastUpdated.toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`p-4 rounded-lg border ${
                sentiment.overall > 0.3 
                  ? 'bg-green-50 border-green-200' 
                  : sentiment.overall < -0.3 
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  sentiment.overall > 0.3 
                    ? 'text-green-600' 
                    : sentiment.overall < -0.3 
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`} />
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1">Rekomendasi</h5>
                  <p className="text-sm text-gray-700">
                    {sentiment.overall > 0.3 
                      ? 'Destinasi ini mendapat ulasan yang sangat positif dari pengunjung. Sangat direkomendasikan untuk dikunjungi!'
                      : sentiment.overall < -0.3 
                        ? 'Destinasi ini mendapat beberapa ulasan negatif. Pertimbangkan untuk mencari alternatif atau baca ulasan detail sebelum berkunjung.'
                        : 'Destinasi ini mendapat ulasan yang beragam. Baca ulasan detail untuk memahami kelebihan dan kekurangannya.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada analisis sentimen tersedia</p>
            <p className="text-sm mt-2">Klik tombol "Perbarui" untuk memulai analisis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
