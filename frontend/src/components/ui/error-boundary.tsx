'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="mx-auto mb-4"
            >
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </motion.div>
            <CardTitle className="text-red-600">Oops! Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang menangani masalah ini.
            </p>
            
            {error && process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                <p className="text-sm text-red-600 font-mono">
                  {error.message}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button onClick={resetError} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                <Home className="w-4 h-4 mr-2" />
                Ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = 'Terjadi Kesalahan', 
  message, 
  onRetry, 
  className = '' 
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
    >
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface NetworkErrorProps {
  onRetry?: () => void
  className?: string
}

export function NetworkError({ onRetry, className = '' }: NetworkErrorProps) {
  return (
    <ErrorMessage
      title="Koneksi Bermasalah"
      message="Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      onRetry={onRetry}
      className={className}
    />
  )
}

interface NotFoundErrorProps {
  resource?: string
  onGoBack?: () => void
  className?: string
}

export function NotFoundError({ 
  resource = 'halaman', 
  onGoBack, 
  className = '' 
}: NotFoundErrorProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          {resource.charAt(0).toUpperCase() + resource.slice(1)} Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, {resource} yang Anda cari tidak dapat ditemukan.
        </p>
        <div className="flex gap-3 justify-center">
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              Kembali
            </Button>
          )}
          <Button onClick={() => window.location.href = '/'}>
            <Home className="w-4 h-4 mr-2" />
            Ke Beranda
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
