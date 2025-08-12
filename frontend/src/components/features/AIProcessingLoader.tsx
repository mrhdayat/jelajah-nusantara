'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, Target, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AIProcessingLoaderProps {
  stage?: 'analyzing' | 'processing' | 'generating' | 'complete'
  message?: string
  className?: string
}

export default function AIProcessingLoader({
  stage = 'analyzing',
  message,
  className = ''
}: AIProcessingLoaderProps) {
  const stages = [
    {
      id: 'analyzing',
      icon: Brain,
      title: 'Menganalisis Query',
      description: 'AI sedang memahami permintaan Anda...',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'processing',
      icon: Zap,
      title: 'Memproses Data',
      description: 'Mengekstrak informasi penting...',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'generating',
      icon: Target,
      title: 'Menyusun Hasil',
      description: 'Menyiapkan rekomendasi terbaik...',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'complete',
      icon: CheckCircle,
      title: 'Selesai',
      description: 'Analisis berhasil diselesaikan!',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ]

  const currentStageIndex = stages.findIndex(s => s.id === stage)
  const currentStage = stages[currentStageIndex]

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <Card className={`${currentStage.bgColor} ${currentStage.borderColor} border-2`}>
        <CardContent className="p-8">
          {/* Main Animation */}
          <div className="text-center mb-8">
            <motion.div
              className="relative mx-auto mb-6"
              style={{ width: '120px', height: '120px' }}
            >
              {/* Outer Ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border-4 ${currentStage.borderColor}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Ring */}
              <motion.div
                className={`absolute inset-2 rounded-full border-2 ${currentStage.borderColor} opacity-60`}
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center Icon */}
              <motion.div
                className={`absolute inset-0 flex items-center justify-center ${currentStage.bgColor} rounded-full`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <currentStage.icon className={`w-12 h-12 ${currentStage.color}`} />
              </motion.div>
              
              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0'
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles 
                    className={`w-4 h-4 ${currentStage.color}`}
                    style={{
                      transform: `translate(-50%, -50%) translate(${40 + i * 10}px, 0)`
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h3
              className={`text-2xl font-bold ${currentStage.color} mb-2`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStage.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {message || currentStage.description}
            </motion.p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {stages.slice(0, -1).map((stageItem, index) => {
              const isActive = index <= currentStageIndex
              const isCurrent = index === currentStageIndex
              
              return (
                <div key={stageItem.id} className="flex items-center">
                  {/* Step Circle */}
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isActive 
                        ? `${stageItem.borderColor} ${stageItem.bgColor} ${stageItem.color}` 
                        : 'border-gray-300 bg-gray-100 text-gray-400'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <stageItem.icon className="w-4 h-4" />
                  </motion.div>

                  {/* Connector Line */}
                  {index < stages.length - 2 && (
                    <motion.div
                      className={`w-12 h-0.5 mx-2 ${
                        index < currentStageIndex ? currentStage.bgColor : 'bg-gray-300'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStageIndex ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${currentStage.color.replace('text-', 'bg-')}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-sm text-gray-500">
              💡 <strong>Tahukah Anda?</strong> AI kami dapat memproses bahasa natural Indonesia dengan akurasi hingga 95%
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
