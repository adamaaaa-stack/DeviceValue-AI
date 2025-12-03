'use client'

import { motion } from 'framer-motion'
import { Share2, Twitter, Instagram, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareButtonsProps {
  deviceData: {
    brand: string
    model: string
    valueMin: number
    valueMax: number
  }
  shareUrl?: string
  onShare?: (platform: string) => void
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export default function SocialShareButtons({ deviceData, shareUrl, onShare }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const shareText = `🔥 My ${deviceData.brand} ${deviceData.model} is worth $${deviceData.valueMin} - $${deviceData.valueMax}! Valued with DeviceValue AI`
  const url = shareUrl || 'https://devicevalue.ai'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    let shareWindow: string
    
    switch (platform) {
      case 'twitter':
        shareWindow = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&hashtags=DeviceValueAI,TechResale`
        break
      case 'tiktok':
        // TikTok doesn't have a direct share URL, so we copy the text
        handleCopyLink()
        return
      case 'instagram':
        // Instagram also doesn't have direct web sharing
        handleCopyLink()
        return
      default:
        return
    }

    window.open(shareWindow, '_blank', 'width=600,height=400')
    onShare?.(platform)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${deviceData.brand} ${deviceData.model} Valuation`,
          text: shareText,
          url: url
        })
        onShare?.('native')
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  return (
    <div className="relative">
      {/* Main Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
      >
        <Share2 className="w-5 h-5" />
        Share Result
      </motion.button>

      {/* Share Options Dropdown */}
      {showShareOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl z-50 min-w-[200px]"
        >
          <p className="text-xs text-slate-400 mb-3 px-2">Share to</p>
          
          {/* X (Twitter) */}
          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Twitter className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">X (Twitter)</span>
          </button>

          {/* TikTok */}
          <button
            onClick={() => handleShare('tiktok')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <TikTokIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">TikTok</span>
            <span className="text-xs text-slate-400 ml-auto">Copy text</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleShare('instagram')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">Instagram</span>
            <span className="text-xs text-slate-400 ml-auto">Copy text</span>
          </button>

          <div className="my-2 border-t border-slate-700" />

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-white font-medium">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
        </motion.div>
      )}

      {/* Click outside to close */}
      {showShareOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareOptions(false)}
        />
      )}
    </div>
  )
}

