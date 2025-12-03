'use client'

import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, CheckCircle, Info, DollarSign, Percent, FileText } from 'lucide-react'

interface DamageAnalysis {
  detected: boolean
  severity: 'none' | 'minor' | 'moderate' | 'severe'
  areas: string[]
  description: string
}

interface ValuationCardProps {
  valueMin: number
  valueMax: number
  confidence: number
  damageAnalysis: DamageAnalysis
  suggestedListing: string
  marketInsights?: string
}

export default function ValuationCard({
  valueMin,
  valueMax,
  confidence,
  damageAnalysis,
  suggestedListing,
  marketInsights
}: ValuationCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'text-emerald-400'
      case 'minor': return 'text-yellow-400'
      case 'moderate': return 'text-orange-400'
      case 'severe': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-emerald-500/20 border-emerald-500/30'
      case 'minor': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'moderate': return 'bg-orange-500/20 border-orange-500/30'
      case 'severe': return 'bg-red-500/20 border-red-500/30'
      default: return 'bg-slate-500/20 border-slate-500/30'
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-emerald-400'
    if (conf >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Value Range Card */}
      <div className="card p-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
          <DollarSign className="w-4 h-4" />
          Estimated Value Range
        </div>
        <div className="flex items-baseline gap-3">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-5xl font-bold text-white"
          >
            ${valueMin.toLocaleString()}
          </motion.span>
          <span className="text-2xl text-slate-400">–</span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-5xl font-bold text-emerald-400"
          >
            ${valueMax.toLocaleString()}
          </motion.span>
        </div>
        
        {/* Confidence meter */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Percent className="w-4 h-4" />
              Confidence Score
            </span>
            <span className={`font-bold ${getConfidenceColor(confidence)}`}>
              {confidence}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                confidence >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                'bg-gradient-to-r from-orange-500 to-red-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Damage Analysis Card */}
      <div className={`card p-6 ${getSeverityBg(damageAnalysis.severity)}`}>
        <div className="flex items-center gap-2 mb-4">
          {damageAnalysis.detected ? (
            <AlertTriangle className={`w-5 h-5 ${getSeverityColor(damageAnalysis.severity)}`} />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          )}
          <h3 className="font-semibold text-white">Damage Analysis</h3>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium capitalize ${getSeverityBg(damageAnalysis.severity)} ${getSeverityColor(damageAnalysis.severity)}`}>
            {damageAnalysis.severity}
          </span>
        </div>
        
        <p className="text-slate-300 mb-4">{damageAnalysis.description}</p>
        
        {damageAnalysis.areas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {damageAnalysis.areas.map((area, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800/50 rounded-full text-sm text-slate-300"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Listing Card */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-white">Suggested Listing</h3>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-200 italic">&ldquo;{suggestedListing}&rdquo;</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(suggestedListing)}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          📋 Copy to clipboard
        </button>
      </div>

      {/* Market Insights Card */}
      {marketInsights && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Market Insights</h3>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300">{marketInsights}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

