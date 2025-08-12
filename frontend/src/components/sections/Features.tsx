'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Users,
  Zap,
  Shield,
  Globe,
  Heart,
  TrendingUp,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI Natural Language Processing",
      description: "Cukup ceritakan keinginan Anda dalam bahasa sehari-hari. AI kami memahami konteks, preferensi, dan nuansa dalam permintaan Anda.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      badge: "Core Feature"
    },
    {
      icon: MapPin,
      title: "Peta Interaktif & Route Planning",
      description: "Visualisasi rute perjalanan dengan peta interaktif Google Maps. Drag-and-drop untuk menyesuaikan urutan destinasi.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      badge: "Interactive"
    },
    {
      icon: Star,
      title: "Analisis Sentimen Real-time",
      description: "Rekomendasi berdasarkan analisis sentimen ulasan terbaru dari berbagai platform review terpercaya.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      badge: "Smart Analysis"
    },
    {
      icon: DollarSign,
      title: "Estimasi Budget Akurat",
      description: "Perhitungan otomatis biaya perjalanan yang transparan dan akurat berdasarkan data real-time.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      badge: "Budget Planning"
    },
    {
      icon: Calendar,
      title: "Optimasi Jadwal Cerdas",
      description: "Penjadwalan yang dioptimalkan berdasarkan waktu operasional, jarak tempuh, dan preferensi aktivitas.",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      badge: "Time Optimization"
    },
    {
      icon: Users,
      title: "Personalisasi Mendalam",
      description: "Rekomendasi yang disesuaikan dengan tipe wisatawan, minat, anggaran, dan karakteristik grup perjalanan.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      badge: "Personalized"
    },
    {
      icon: MessageCircle,
      title: "AI Chat Assistant 24/7",
      description: "Asisten virtual yang siap membantu perencanaan perjalanan Anda kapan saja dengan respons yang cerdas.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      badge: "24/7 Support"
    },
    {
      icon: TrendingUp,
      title: "Rekomendasi Trending",
      description: "Destinasi dan aktivitas yang sedang trending berdasarkan data wisatawan terkini dan seasonal trends.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      badge: "Trending"
    },
    {
      icon: Shield,
      title: "Keamanan & Privasi",
      description: "Data perjalanan Anda aman dengan enkripsi end-to-end dan tidak dibagikan kepada pihak ketiga.",
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50",
      badge: "Secure"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Fitur Unggulan
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Teknologi AI
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Terdepan
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Platform kami menggunakan teknologi artificial intelligence terbaru untuk memberikan 
            pengalaman perencanaan perjalanan yang tak tertandingi dan personal.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-8">
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className={`h-1 w-0 bg-gradient-to-r ${feature.color} mt-6 group-hover:w-full transition-all duration-500 rounded-full`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-lg">
              Jelajahi Semua Fitur
            </span>
            <Heart className="w-6 h-6 text-red-300 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
