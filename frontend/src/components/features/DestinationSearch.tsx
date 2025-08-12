'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign,
  Grid,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Destination, DestinationCategory, PriceRange } from '@/types'
import { searchDestinations, getDestinationCategories } from '@/lib/api'
import { debounce } from '@/lib/utils'
import DestinationCard from './DestinationCard'
import { DestinationCardSkeleton } from '@/components/ui/loading'
import { ErrorMessage } from '@/components/ui/error-boundary'

interface SearchFilters {
  category?: DestinationCategory
  priceRange?: PriceRange
  city?: string
  province?: string
  minRating?: number
}

interface DestinationSearchProps {
  onDestinationSelect?: (destination: Destination) => void
  selectedDestinations?: string[]
  showMap?: boolean
  className?: string
}

export default function DestinationSearch({
  onDestinationSelect,
  selectedDestinations = [],
  showMap = false,
  className = ''
}: DestinationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<string[]>([])

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (query: string, searchFilters: SearchFilters, pageNum: number = 1) => {
      setIsLoading(true)
      setError(null)

      try {
        const params = {
          q: query || undefined,
          category: searchFilters.category,
          price_range: searchFilters.priceRange,
          city: searchFilters.city,
          province: searchFilters.province,
          min_rating: searchFilters.minRating,
          page: pageNum,
          page_size: 12
        }

        const result = await searchDestinations(params)
        
        if (pageNum === 1) {
          setDestinations(result.destinations)
        } else {
          setDestinations(prev => [...prev, ...result.destinations])
        }
        
        setTotal(result.total)
        setHasMore(result.destinations.length === 12)
      } catch (err) {
        setError('Gagal memuat destinasi. Silakan coba lagi.')
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    []
  )

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getDestinationCategories()
        if (result.success && result.data) {
          setCategories(result.data)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Initial search
  useEffect(() => {
    debouncedSearch('', {}, 1)
  }, [debouncedSearch])

  // Search when query or filters change
  useEffect(() => {
    setPage(1)
    debouncedSearch(searchQuery, filters, 1)
  }, [searchQuery, filters, debouncedSearch])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    debouncedSearch(searchQuery, filters, nextPage)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-500" />
              Jelajahi Destinasi
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari destinasi, kota, atau aktivitas..."
              className="pl-10 pr-4"
            />
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rentang Harga
                    </label>
                    <select
                      value={filters.priceRange || ''}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Semua Harga</option>
                      <option value="budget">Budget</option>
                      <option value="moderate">Moderate</option>
                      <option value="expensive">Mahal</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota
                    </label>
                    <Input
                      value={filters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      placeholder="Nama kota"
                    />
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating Minimal
                    </label>
                    <select
                      value={filters.minRating || ''}
                      onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Semua Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4.0">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                      <option value="3.0">3.0+ ⭐</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Hapus Filter
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {isLoading ? 'Mencari...' : `${total} destinasi ditemukan`}
            </span>
            {searchQuery && (
              <span>untuk "{searchQuery}"</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => debouncedSearch(searchQuery, filters, 1)}
        />
      )}

      {/* Results */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {/* Loading Skeletons */}
        {isLoading && destinations.length === 0 && (
          Array.from({ length: 8 }).map((_, index) => (
            <DestinationCardSkeleton key={index} />
          ))
        )}

        {/* Destination Cards */}
        {destinations.map((destination) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DestinationCard
              destination={destination}
              onSelect={onDestinationSelect}
              isFavorited={selectedDestinations.includes(destination.id)}
              className={viewMode === 'list' ? 'flex-row' : ''}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && destinations.length > 0 && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && destinations.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tidak ada destinasi ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah kata kunci pencarian atau filter yang digunakan
            </p>
            <Button onClick={clearFilters} variant="outline">
              Reset Pencarian
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
