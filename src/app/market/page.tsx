'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import MarketComparisonTable from '@/components/MarketComparisonTable'
import { Search, Loader2, TrendingUp, Smartphone } from 'lucide-react'

interface MarketData {
  recentSales: Array<{
    price: number
    condition: string
    date: string
    platform: string
  }>
  averagePrice: number
  priceRange: { min: number; max: number }
  demandLevel: 'low' | 'medium' | 'high'
}

function MarketContent() {
  const searchParams = useSearchParams()
  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [model, setModel] = useState(searchParams.get('model') || '')
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('brand') && searchParams.get('model')) {
      handleSearch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async () => {
    if (!brand || !model) return

    setLoading(true)
    setSearched(true)
    setError('')
    setMarketData(null)

    try {
      const response = await fetch(`/api/market/comparison?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`)
      const data = await response.json()
      
      if (response.ok && data.comparison) {
        setMarketData(data.comparison)
      } else {
        setError(data.error || 'Failed to fetch market data')
      }
    } catch {
      setError('Failed to connect to market data service')
    } finally {
      setLoading(false)
    }
  }

  const popularDevices = [
    { brand: 'Apple', model: 'iPhone 15 Pro' },
    { brand: 'Samsung', model: 'Galaxy S24 Ultra' },
    { brand: 'Google', model: 'Pixel 8 Pro' },
    { brand: 'Apple', model: 'MacBook Pro M3' },
    { brand: 'Apple', model: 'iPad Pro' },
    { brand: 'Samsung', model: 'Galaxy Z Fold 5' },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Real-time Market Data
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Market Comparison
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Search for any device to see recent sales data, average prices, and market demand
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-2">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Apple, Samsung"
                  className="input-field"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-2">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., iPhone 15 Pro, Galaxy S24"
                  className="input-field"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={!brand || !model || loading}
                  className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Popular devices */}
            <div className="mt-6">
              <p className="text-sm text-slate-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularDevices.map((device) => (
                  <button
                    key={`${device.brand}-${device.model}`}
                    onClick={() => {
                      setBrand(device.brand)
                      setModel(device.model)
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors flex items-center gap-2"
                  >
                    <Smartphone className="w-3 h-3" />
                    {device.brand} {device.model}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-400">Fetching market data...</p>
              </div>
            </div>
          )}

          {!loading && marketData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {brand} {model}
                </h2>
                <p className="text-slate-400 text-sm">
                  Market data from the last 30 days
                </p>
              </div>
              <MarketComparisonTable
                recentSales={marketData.recentSales}
                averagePrice={marketData.averagePrice}
                priceRange={marketData.priceRange}
                demandLevel={marketData.demandLevel}
              />
            </motion.div>
          )}

          {!loading && searched && !marketData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400">{error || 'No market data found for this device'}</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your search terms or try again</p>
            </motion.div>
          )}

          {!loading && !searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400">Enter a device to see market data</p>
              <p className="text-slate-500 text-sm mt-2">Or click on a popular device above</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MarketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    }>
      <MarketContent />
    </Suspense>
  )
}

