'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ExternalLink, BarChart3 } from 'lucide-react'

interface Sale {
  price: number
  condition: string
  date: string
  platform: string
}

interface MarketComparisonTableProps {
  recentSales: Sale[]
  averagePrice: number
  priceRange: { min: number; max: number }
  demandLevel: 'low' | 'medium' | 'high'
  aiValueMin?: number
  aiValueMax?: number
}

export default function MarketComparisonTable({
  recentSales,
  averagePrice,
  priceRange,
  demandLevel,
  aiValueMin,
  aiValueMax
}: MarketComparisonTableProps) {
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-emerald-400 bg-emerald-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'low': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'text-emerald-400'
      case 'good': return 'text-teal-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform.charAt(0).toUpperCase()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={rowVariants} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Average Price</p>
              <p className="text-2xl font-bold text-white">${averagePrice.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={rowVariants} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Price Range</p>
              <p className="text-2xl font-bold text-white">
                ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={rowVariants} className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Market Demand</p>
              <p className={`text-2xl font-bold capitalize ${getDemandColor(demandLevel).split(' ')[0]}`}>
                {demandLevel}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${getDemandColor(demandLevel)}`}>
              {demandLevel === 'high' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI vs Market Comparison */}
      {aiValueMin && aiValueMax && (
        <motion.div variants={rowVariants} className="card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-400">✨</span> AI Valuation vs Market
          </h3>
          <div className="relative h-16">
            {/* Market range bar */}
            <div className="absolute top-4 left-0 right-0 h-2 bg-slate-700 rounded-full" />
            <div 
              className="absolute top-4 h-2 bg-slate-500 rounded-full"
              style={{
                left: `${((priceRange.min / priceRange.max) * 0.3) * 100}%`,
                right: `${(1 - 0.95) * 100}%`
              }}
            />
            {/* AI range bar */}
            <div 
              className="absolute top-4 h-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{
                left: `${((aiValueMin - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                width: `${((aiValueMax - aiValueMin) / (priceRange.max - priceRange.min)) * 100}%`
              }}
            />
            {/* Labels */}
            <div className="absolute top-10 left-0 text-xs text-slate-500">
              ${priceRange.min}
            </div>
            <div className="absolute top-10 right-0 text-xs text-slate-500">
              ${priceRange.max}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-500 rounded" />
              <span className="text-slate-400">Market Range</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded" />
              <span className="text-slate-400">AI Estimate</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Recent Sales Table */}
      <motion.div variants={rowVariants} className="card overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="font-semibold text-white">Recent Sales</h3>
          <p className="text-sm text-slate-400">Similar devices sold in the last 30 days</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="px-5 py-3 font-medium">Platform</th>
                <th className="px-5 py-3 font-medium">Condition</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                        {getPlatformIcon(sale.platform)}
                      </div>
                      <span className="text-white">{sale.platform}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-medium ${getConditionColor(sale.condition)}`}>
                      {sale.condition}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-white font-semibold">
                      ${sale.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {sale.date}
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-slate-400 hover:text-emerald-400 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

