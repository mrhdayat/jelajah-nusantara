'use client'

import { useState } from 'react'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'
import TravelQueryForm from '@/components/features/TravelQueryForm'
import ItineraryDisplay from '@/components/features/ItineraryDisplay'
import { generateItinerary } from '@/lib/api'
import { ItineraryGenerationRequest, Itinerary } from '@/types'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'query' | 'itinerary'>('landing')
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQueryProcessed = (parsedData: any) => {
    console.log('Query processed:', parsedData)
  }

  const handleGenerateItinerary = async (parsedData: any) => {
    if (!parsedData.destination || !parsedData.duration) {
      toast.error('Destinasi dan durasi perjalanan harus diisi')
      return
    }

    setIsGenerating(true)

    try {
      const request: ItineraryGenerationRequest = {
        destination: parsedData.destination,
        duration: parsedData.duration,
        budget: parsedData.budget || 1000000,
        traveler_count: parsedData.traveler_count || 1,
        traveler_type: parsedData.traveler_type || 'solo',
        interests: parsedData.interests || [],
        activity_level: parsedData.activity_level || 'moderate',
        start_date: parsedData.start_date
      }

      const result = await generateItinerary(request)

      if (result.itinerary) {
        setGeneratedItinerary(result.itinerary)
        setCurrentStep('itinerary')
        toast.success('Itinerary berhasil dibuat!')
      } else {
        toast.error('Gagal membuat itinerary')
      }
    } catch (error) {
      console.error('Error generating itinerary:', error)
      toast.error('Terjadi kesalahan saat membuat itinerary')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBackToQuery = () => {
    setCurrentStep('query')
    setGeneratedItinerary(null)
  }

  const handleStartPlanning = () => {
    setCurrentStep('query')
  }

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />

        {/* Travel Form Section */}
        <section id="travel-form" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Mulai Perencanaan Perjalanan Anda
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Ceritakan keinginan perjalanan Anda dalam bahasa alami, dan biarkan AI kami
                membuat itinerary yang sempurna untuk petualangan Anda di Indonesia
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <TravelQueryForm
                onQueryProcessed={handleQueryProcessed}
                onGenerateItinerary={handleGenerateItinerary}
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Travel Planning Interface */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 min-h-screen">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="mb-8">
            <button
              onClick={() => setCurrentStep('landing')}
              className="text-white/80 hover:text-white underline mb-4"
            >
              ← Kembali ke Beranda
            </button>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Jelajah Nusantara AI
            </h1>
          </div>

          {/* Travel Query Form or Itinerary Display */}
          <div className="max-w-6xl mx-auto">
            {currentStep === 'query' ? (
              <TravelQueryForm
                onQueryProcessed={handleQueryProcessed}
                onGenerateItinerary={handleGenerateItinerary}
              />
            ) : generatedItinerary ? (
              <div className="space-y-6">
                <div className="text-center">
                  <button
                    onClick={handleBackToQuery}
                    className="text-white/80 hover:text-white underline"
                  >
                    ← Kembali ke Form Query
                  </button>
                </div>
                <ItineraryDisplay
                  itinerary={generatedItinerary}
                  onEdit={() => toast('Fitur edit akan segera tersedia')}
                  onShare={() => toast('Fitur share akan segera tersedia')}
                  onDownload={() => toast('Fitur download akan segera tersedia')}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

    </div>
  )
}
