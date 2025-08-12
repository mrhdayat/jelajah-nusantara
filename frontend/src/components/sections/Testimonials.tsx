'use client'

import { motion } from 'framer-motion'
import { Star, Quote, MapPin, Calendar, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Travel Blogger",
      location: "Jakarta",
      avatar: "/avatars/sarah.jpg",
      rating: 5,
      text: "Luar biasa! AI-nya benar-benar memahami keinginan saya. Itinerary 7 hari di Lombok yang dibuat sangat detail dan sesuai budget. Semua tempat yang direkomendasikan ternyata hidden gems yang amazing!",
      trip: "Lombok Adventure",
      savings: "Hemat 40% dari budget awal"
    },
    {
      name: "Budi Santoso",
      role: "Fotografer",
      location: "Bandung",
      avatar: "/avatars/budi.jpg",
      rating: 5,
      text: "Sebagai fotografer, saya butuh spot-spot fotogenik. AI ini merekomendasikan lokasi sunrise/sunset terbaik dengan timing yang perfect. Hasil foto trip ke Bromo jadi portfolio terbaik saya!",
      trip: "Bromo Photography Tour",
      savings: "Dapat 15 spot foto terbaik"
    },
    {
      name: "Maya & Rizki",
      role: "Pasangan Honeymoon",
      location: "Surabaya",
      avatar: "/avatars/maya-rizki.jpg",
      rating: 5,
      text: "Honeymoon di Bali jadi tak terlupakan berkat rekomendasi AI ini. Dari villa romantis, dinner di pantai, sampai aktivitas couple yang seru. Semuanya terorganisir dengan sempurna!",
      trip: "Bali Honeymoon",
      savings: "Pengalaman tak ternilai"
    },
    {
      name: "Keluarga Hartono",
      role: "Family Trip",
      location: "Medan",
      avatar: "/avatars/hartono.jpg",
      rating: 5,
      text: "Traveling dengan 2 anak balita itu challenging. Tapi AI ini merekomendasikan tempat-tempat family-friendly di Yogya dengan fasilitas lengkap. Anak-anak happy, ortu juga enjoy!",
      trip: "Yogyakarta Family Trip",
      savings: "Zero drama dengan anak-anak"
    },
    {
      name: "Andi Pratama",
      role: "Solo Backpacker",
      location: "Makassar",
      avatar: "/avatars/andi.jpg",
      rating: 5,
      text: "Budget minim tapi pengen explore Flores? AI ini kasih solusi backpacking route yang ekonomis tapi tetap seru. Dari transportasi lokal sampai homestay murah, semua ter-cover!",
      trip: "Flores Backpacking",
      savings: "Budget cuma 2 juta untuk 10 hari"
    },
    {
      name: "Lisa Chen",
      role: "Digital Nomad",
      location: "Bali",
      avatar: "/avatars/lisa.jpg",
      rating: 5,
      text: "Sebagai digital nomad, saya butuh tempat dengan WiFi kencang dan coworking space. AI ini ngerti banget kebutuhan remote worker. Rekomendasi cafe dan workspace di Canggu top banget!",
      trip: "Bali Workation",
      savings: "Produktivitas meningkat 200%"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Testimoni Pengguna
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Cerita
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {" "}Sukses
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Ribuan wisatawan telah merasakan kemudahan dan keajaiban perencanaan perjalanan 
            dengan AI kami. Inilah cerita mereka.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              { number: "10,000+", label: "Perjalanan Direncanakan", icon: MapPin },
              { number: "4.9/5", label: "Rating Pengguna", icon: Star },
              { number: "95%", label: "Tingkat Kepuasan", icon: Heart },
              { number: "30%", label: "Rata-rata Penghematan", icon: Calendar }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="w-8 h-8 text-blue-500 opacity-50" />
                    
                    {/* Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed mb-6 group-hover:text-gray-600 transition-colors">
                    "{testimonial.text}"
                  </p>

                  {/* Trip Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-700">{testimonial.trip}</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      ✨ {testimonial.savings}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-xs text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Bergabunglah dengan Ribuan Wisatawan Bahagia
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Wujudkan perjalanan impian Anda dengan bantuan AI yang telah dipercaya 
              oleh ribuan traveler di seluruh Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Mulai Perjalanan Anda
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                Lihat Lebih Banyak Testimoni
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
