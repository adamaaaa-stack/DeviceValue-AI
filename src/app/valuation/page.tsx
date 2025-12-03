'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ValuationCard from '@/components/ValuationCard'
import PDFExportButton from '@/components/PDFExportButton'
import SocialShareButtons from '@/components/SocialShareButtons'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Save, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ValuationResult {
  valueMin: number
  valueMax: number
  confidence: number
  damageAnalysis: {
    detected: boolean
    severity: 'none' | 'minor' | 'moderate' | 'severe'
    areas: string[]
    description: string
  }
  suggestedListing: string
  marketInsights: string
  deviceSpecs: {
    brand: string
    model: string
    storage: string
    ram: string
    accessories: string
  }
  photoUrl?: string
}

export default function ValuationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('valuationResult')
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.push('/upload')
    }
  }, [router])

  const handleSave = async () => {
    if (!user || !result) return
    
    setSaving(true)
    // In a real app, this would save to Supabase
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
    }, 1000)
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            href="/upload" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            New Valuation
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Valuation Complete! 🎉
                </h1>
                <p className="text-slate-400">
                  {result.deviceSpecs.brand} {result.deviceSpecs.model}
                  {result.deviceSpecs.storage && ` • ${result.deviceSpecs.storage}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - Device photo & actions */}
            <div className="space-y-6">
              {/* Device photo */}
              {result.photoUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={result.photoUrl}
                      alt="Device"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="space-y-3">
                <SocialShareButtons
                  deviceData={{
                    brand: result.deviceSpecs.brand,
                    model: result.deviceSpecs.model,
                    valueMin: result.valueMin,
                    valueMax: result.valueMax
                  }}
                />
                
                <PDFExportButton
                  deviceData={{
                    brand: result.deviceSpecs.brand,
                    model: result.deviceSpecs.model,
                    storage: result.deviceSpecs.storage,
                    ram: result.deviceSpecs.ram,
                    accessories: result.deviceSpecs.accessories,
                    valueMin: result.valueMin,
                    valueMax: result.valueMax,
                    confidence: result.confidence,
                    suggestedListing: result.suggestedListing,
                    damageAnalysis: {
                      severity: result.damageAnalysis.severity,
                      description: result.damageAnalysis.description
                    }
                  }}
                />

                {user && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                      <>✓ Saved to History</>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save to History
                      </>
                    )}
                  </motion.button>
                )}
              </div>

            </div>

            {/* Right column - Valuation details */}
            <div className="lg:col-span-2">
              <ValuationCard
                valueMin={result.valueMin}
                valueMax={result.valueMax}
                confidence={result.confidence}
                damageAnalysis={result.damageAnalysis}
                suggestedListing={result.suggestedListing}
                marketInsights={result.marketInsights}
              />

              {/* Market comparison CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Link href={`/market?brand=${result.deviceSpecs.brand}&model=${result.deviceSpecs.model}`}>
                  <div className="card card-hover p-6 flex items-center justify-between group">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        View Market Comparison
                      </h3>
                      <p className="text-slate-400 text-sm">
                        See how your device compares to recent sales
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

