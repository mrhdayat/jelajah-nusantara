'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Calendar, Users, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { processTravelQuery } from '@/lib/api'
import { TravelQueryRequest } from '@/types'
import QueryResultDisplay from './QueryResultDisplay'
import AIProcessingLoader from './AIProcessingLoader'
import toast from 'react-hot-toast'

// Helper function to get AI provider display name for IBM Demo
function getAIProviderDisplay(provider: string): string {
  const providerMap: { [key: string]: string } = {
    'ibm_watson': 'IBM Watson Orchestrate 🔵',
    'replicate_granite': 'IBM Granite (Replicate) 🟡',
    'huggingface': 'Hugging Face 🟢',
    'frontend_mock': 'Mock Data 🔴',
    'backend_api': 'Backend API',
    'mock_data': 'Demo Data'
  }
  return providerMap[provider] || provider
}

interface TravelQueryFormProps {
  onQueryProcessed?: (result: any) => void
  onGenerateItinerary?: (data: any) => void
}

export default function TravelQueryForm({ onQueryProcessed, onGenerateItinerary }: TravelQueryFormProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [parsedResult, setParsedResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Advanced form fields
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('')
  const [budget, setBudget] = useState('')
  const [travelerCount, setTravelerCount] = useState('')
  const [interests, setInterests] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast.error('Silakan masukkan rencana perjalanan Anda')
      return
    }

    setIsLoading(true)
    
    try {
      // Build enhanced query string with all parameters
      let enhancedQuery = query.trim()
      if (destination) enhancedQuery += ` ke ${destination}`
      if (duration) enhancedQuery += ` selama ${duration} hari`
      if (budget) enhancedQuery += ` dengan budget ${budget} rupiah`
      if (travelerCount) enhancedQuery += ` untuk ${travelerCount} orang`
      if (interests) enhancedQuery += ` dengan minat ${interests}`

      const result = await processTravelQuery(enhancedQuery)
      
      if (result.success && result.data) {
        setParsedResult(result.data)
        onQueryProcessed?.(result.data)

        // Show AI provider info for IBM demo
        const providerInfo = getAIProviderDisplay(result.ai_provider || 'backend_api')
        toast.success(`Query berhasil diproses dengan ${providerInfo}!`)
      } else {
        toast.error(result.message || 'Gagal memproses query')
      }
    } catch (error) {
      console.error('Error processing query:', error)
      toast.error('Terjadi kesalahan saat memproses query')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateItinerary = () => {
    if (parsedResult) {
      onGenerateItinerary?.(parsedResult)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* AI Processing Loader */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <AIProcessingLoader
            stage="analyzing"
            message="AI sedang menganalisis permintaan perjalanan Anda..."
          />
        </motion.div>
      )}
      {/* Main Query Form */}
      {!isLoading && !parsedResult && (
        <Card className="glass border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            Ceritakan Rencana Perjalanan Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: Saya ingin liburan 3 hari di Bali bersama keluarga, suka pantai yang tenang dan kuliner lokal, budget 5 juta rupiah..."
                className="min-h-32 bg-white/90 border-white/30 text-gray-800 placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-400"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-white hover:bg-white/10"
              >
                {showAdvanced ? 'Sembunyikan' : 'Tampilkan'} Opsi Lanjutan
              </Button>

              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                variant="gradient"
                size="lg"
                className="min-w-48"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Proses dengan AI
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Advanced Options */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Destinasi
                  </label>
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Bali, Jakarta, dll"
                    className="bg-white/90 border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Durasi (hari)
                  </label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3"
                    min="1"
                    max="30"
                    className="bg-white/90 border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Budget (Rp)
                  </label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000000"
                    min="0"
                    className="bg-white/90 border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Jumlah Orang
                  </label>
                  <Input
                    type="number"
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(e.target.value)}
                    placeholder="2"
                    min="1"
                    max="20"
                    className="bg-white/90 border-white/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    Minat (pisahkan dengan koma)
                  </label>
                  <Input
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="pantai, kuliner, budaya, alam"
                    className="bg-white/90 border-white/30"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Parsed Result Display */}
      {parsedResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <QueryResultDisplay
            parsedQuery={parsedResult}
            onGenerateItinerary={handleGenerateItinerary}
            onEditQuery={() => {
              setParsedResult(null)
              setQuery('')
            }}
          />
        </motion.div>
      )}
    </div>
  )
}
