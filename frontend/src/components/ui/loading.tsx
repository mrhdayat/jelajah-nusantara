'use client'

import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingCard({ 
  title = 'Memproses...', 
  description = 'Mohon tunggu sebentar',
  className = '' 
}: LoadingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-4"
      >
        <Sparkles className="w-12 h-12 text-blue-500" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
}

export function LoadingOverlay({ 
  isVisible, 
  title = 'Memproses dengan AI...', 
  description = 'Sedang menganalisis permintaan Anda dan membuat itinerary yang sempurna' 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <LoadingCard title={title} description={description} className="max-w-md w-full" />
    </motion.div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export function DestinationCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}

export function ItinerarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg p-6">
        <Skeleton className="h-8 w-1/2 mb-4 bg-white/20" />
        <Skeleton className="h-4 w-3/4 mb-6 bg-white/20" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16 bg-white/20" />
              <Skeleton className="h-6 w-20 bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Days skeleton */}
      {[1, 2, 3].map((day) => (
        <div key={day} className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="w-12 text-center">
                  <Skeleton className="w-3 h-3 rounded-full mx-auto mb-1" />
                  <Skeleton className="h-3 w-8 mx-auto" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
