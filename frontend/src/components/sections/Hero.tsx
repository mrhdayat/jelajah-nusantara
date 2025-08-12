'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function Hero() {
  const scrollToForm = () => {
    const formSection = document.getElementById('travel-form')
    formSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BackgroundBeams />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI Technology</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <div className="mb-8">
            <TextGenerateEffect
              words="Jelajah Nusantara AI"
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            />
          </div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl md:text-4xl font-semibold text-white/90 mb-6"
          >
            Perencana Rute Wisata Personalisasi
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Cukup ceritakan keinginan perjalanan Anda dalam bahasa alami, dan biarkan AI kami 
            membuat itinerary yang sempurna untuk petualangan tak terlupakan di Indonesia. 
            Dari pantai eksotis hingga gunung menawan, temukan destinasi impian Anda.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto"
          >
            {[
              { icon: MapPin, number: "1000+", label: "Destinasi Wisata" },
              { icon: Calendar, number: "10K+", label: "Itinerary Dibuat" },
              { icon: Sparkles, number: "95%", label: "Akurasi AI" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              onClick={scrollToForm}
              className="bg-white text-black font-semibold px-8 py-4 text-lg"
            >
              <span className="flex items-center gap-2">
                Mulai Perencanaan
                <ArrowRight className="w-5 h-5" />
              </span>
            </HoverBorderGradient>

            <Button
              variant="ghost"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Lihat Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60"
          >
            <div className="text-white/60 text-sm">Dipercaya oleh:</div>
            {[
              "Kementerian Pariwisata",
              "Wonderful Indonesia",
              "Travel Blogger Indonesia",
              "Komunitas Backpacker"
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                className="text-white/40 text-sm font-medium"
              >
                {partner}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
