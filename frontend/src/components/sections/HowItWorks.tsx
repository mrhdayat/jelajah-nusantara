'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Brain, MapPin, Calendar, Download, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: MessageSquare,
      title: "Ceritakan Keinginan Anda",
      description: "Tulis permintaan perjalanan dalam bahasa alami. Contoh: 'Saya ingin liburan 3 hari di Bali bersama keluarga, budget 5 juta, suka pantai dan kuliner'",
      color: "from-blue-500 to-cyan-500",
      example: "Saya ingin liburan romantis 5 hari di Yogyakarta dengan budget 3 juta..."
    },
    {
      step: 2,
      icon: Brain,
      title: "AI Menganalisis Permintaan",
      description: "Sistem AI kami memproses bahasa natural Anda, mengekstrak informasi penting seperti destinasi, durasi, budget, dan preferensi aktivitas.",
      color: "from-purple-500 to-pink-500",
      example: "Destinasi: Yogyakarta | Durasi: 5 hari | Budget: 3 juta | Tipe: Romantis"
    },
    {
      step: 3,
      icon: MapPin,
      title: "Rekomendasi Cerdas",
      description: "Berdasarkan analisis AI, sistem memberikan rekomendasi destinasi, aktivitas, dan rute yang sesuai dengan preferensi dan budget Anda.",
      color: "from-green-500 to-emerald-500",
      example: "Malioboro Street, Taman Sari, Prambanan Temple, Gudeg Yu Djum..."
    },
    {
      step: 4,
      icon: Calendar,
      title: "Itinerary Terstruktur",
      description: "AI menyusun jadwal perjalanan yang optimal dengan mempertimbangkan waktu operasional, jarak tempuh, dan flow aktivitas yang logis.",
      color: "from-orange-500 to-red-500",
      example: "Hari 1: Check-in → Malioboro → Gudeg | Hari 2: Prambanan → Taman Sari..."
    },
    {
      step: 5,
      icon: Download,
      title: "Siap Digunakan",
      description: "Dapatkan itinerary lengkap dengan peta interaktif, estimasi biaya detail, dan tips perjalanan. Bisa diunduh atau dibagikan dengan mudah.",
      color: "from-teal-500 to-cyan-500",
      example: "PDF itinerary, Google Maps integration, budget breakdown, travel tips"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Cara Kerja
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Mudah dalam
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}5 Langkah
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Dari ide perjalanan hingga itinerary lengkap hanya dalam hitungan menit. 
            Proses yang sederhana namun didukung teknologi AI yang canggih.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-32 w-0.5 h-24 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2 z-0" />
              )}

              <div className={`flex flex-col lg:flex-row items-center gap-12 mb-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm flex items-center justify-center`}>
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Example */}
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-gradient-to-b from-gray-300 to-gray-400">
                    <div className="text-sm text-gray-500 mb-1">Contoh:</div>
                    <div className="text-gray-700 italic">"{step.example}"</div>
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <Card className="w-80 h-64 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                      {/* Icon with Animation */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} p-5 mb-6 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <step.icon className="w-full h-full text-white" />
                      </motion.div>

                      {/* Step Number */}
                      <div className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-2`}>
                        Langkah {step.step}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(step.step / steps.length) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${step.color}`}
                        />
                      </div>

                      <div className="text-sm text-gray-500">
                        {step.step} dari {steps.length} langkah
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Arrow for larger screens */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  viewport={{ once: true }}
                  className="hidden lg:block absolute left-1/2 top-80 transform -translate-x-1/2 z-10"
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Siap Mencoba Sendiri?
            </h3>
            <p className="text-purple-100 mb-6">
              Mulai perencanaan perjalanan impian Anda sekarang juga. 
              Gratis dan tanpa perlu registrasi!
            </p>
            <button className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Mulai Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
