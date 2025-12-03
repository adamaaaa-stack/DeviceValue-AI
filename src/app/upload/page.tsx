'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import PhotoUpload from '@/components/PhotoUpload'
import SpecsForm from '@/components/SpecsForm'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, ArrowRight, Loader2, AlertCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface DeviceSpecs {
  brand: string
  model: string
  storage: string
  ram: string
  accessories: string
}

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)
  const [specs, setSpecs] = useState<DeviceSpecs>({
    brand: '',
    model: '',
    storage: '',
    ram: '',
    accessories: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoSelect = (file: File, base64: string) => {
    setSelectedPhoto(URL.createObjectURL(file))
    setPhotoBase64(base64)
  }

  const handlePhotoRemove = () => {
    setSelectedPhoto(null)
    setPhotoBase64(null)
  }

  const canProceed = specs.brand && specs.model

  const handleSubmit = async () => {
    if (!canProceed) return

    setLoading(true)
    setError('')

    try {
      // Call the valuate API
      const response = await fetch('/api/device/valuate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          brand: specs.brand,
          model: specs.model,
          storage: specs.storage,
          ram: specs.ram,
          accessories: specs.accessories,
          photoBase64: photoBase64
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to valuate device')
      }

      // Store result in sessionStorage for the result page
      sessionStorage.setItem('valuationResult', JSON.stringify({
        ...data.analysis,
        deviceSpecs: specs,
        photoUrl: selectedPhoto
      }))

      router.push('/valuation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-6 lg:px-8 xl:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-white text-sm">
                1
              </span>
              <span className="text-sm font-medium">Photo</span>
            </div>
            <div className="w-8 h-px bg-slate-700" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <span className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-white text-sm">
                2
              </span>
              <span className="text-sm font-medium">Details</span>
            </div>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {step === 1 ? 'Upload Your Device Photo' : 'Enter Device Details'}
            </h1>
            <p className="text-slate-400">
              {step === 1 
                ? 'Take a clear photo or upload from your gallery for accurate damage analysis'
                : 'Tell us about your device to get the most accurate valuation'
              }
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Content */}
          <div className="card p-6 lg:p-8 xl:p-10">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PhotoUpload
                  onPhotoSelect={handlePhotoSelect}
                  selectedPhoto={selectedPhoto}
                  onRemove={handlePhotoRemove}
                />
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 text-slate-400 hover:text-white py-3 text-sm transition-colors"
                  >
                    Skip photo (less accurate)
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SpecsForm specs={specs} onChange={setSpecs} />
                
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: canProceed ? 1.02 : 1 }}
                    whileTap={{ scale: canProceed ? 0.98 : 1 }}
                    onClick={handleSubmit}
                    disabled={!canProceed || loading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Get AI Valuation
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Help text */}
          {!user && (
            <p className="text-center text-slate-500 text-sm mt-6">
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
                Create an account
              </Link>
              {' '}to save your valuations and earn clout points!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

