'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, ImageIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploadProps {
  onPhotoSelect: (file: File, base64: string) => void
  selectedPhoto: string | null
  onRemove: () => void
}

export default function PhotoUpload({ onPhotoSelect, selectedPhoto, onRemove }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsProcessing(true)
    
    // Convert to base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      onPhotoSelect(file, base64)
      setIsProcessing(false)
    }
    reader.readAsDataURL(file)
  }, [onPhotoSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedPhoto ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden group"
          >
            <Image
              src={selectedPhoto}
              alt="Device preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </motion.button>
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="glass-dark rounded-xl px-4 py-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/90">AI will analyze this image for damage</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative aspect-square max-w-md mx-auto rounded-2xl border-2 border-dashed
              transition-all duration-300 cursor-pointer
              ${isDragging 
                ? 'border-emerald-400 bg-emerald-500/10' 
                : 'border-slate-600 hover:border-emerald-500/50 bg-slate-800/50'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-emerald-400" />
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-2xl border border-slate-600">
                        <ImageIcon className="w-12 h-12 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                  <p className="text-lg font-semibold text-white mb-2">
                    {isDragging ? 'Drop your photo here!' : 'Upload Device Photo'}
                  </p>
                  <p className="text-sm text-slate-400 mb-6">
                    Drag & drop or click to browse
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Gallery
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        cameraInputRef.current?.click()
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </button>
                  </div>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

