'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { 
  Smartphone, Sparkles, TrendingUp, Shield, Zap, ChevronRight, 
  DollarSign, Camera, BarChart3, Star
} from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'Photo Analysis',
      description: 'AI scans your device photos to detect scratches, dents, and wear patterns'
    },
    {
      icon: BarChart3,
      title: 'Market Comparison',
      description: 'Real-time pricing data from eBay, Swappa, and Facebook Marketplace'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get accurate valuations in seconds, not hours'
    },
    {
      icon: Shield,
      title: 'Trusted Estimates',
      description: 'Confidence scores show how reliable each valuation is'
    }
  ]

  const demoValuation = {
    device: 'iPhone 14 Pro',
    valueRange: '$650 - $780',
    confidence: 94
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Device Valuation
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Know Your
                <span className="block gradient-text">Device&apos;s Worth</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 max-w-lg">
                Upload photos of your phone, laptop, or tablet. Our AI analyzes condition, 
                compares market prices, and gives you an accurate resale value in seconds.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href={user ? '/upload' : '/signup'}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2 text-lg"
                  >
                    <DollarSign className="w-5 h-5" />
                    Check Your Device Value
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <Link href="/market">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex items-center gap-2 text-lg"
                  >
                    <TrendingUp className="w-5 h-5" />
                    View Market Prices
                  </motion.button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-900" />
                    ))}
                  </div>
                  <span>10K+ devices valued</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1">4.9/5</span>
                </div>
              </div>
            </motion.div>

            {/* Right column - Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-75" />
              
              {/* Demo valuation card */}
              <div className="relative glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Example Valuation</p>
                    <h3 className="text-2xl font-bold text-white">{demoValuation.device}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm mb-2">Estimated Value Range</p>
                    <p className="text-4xl font-bold gradient-text">{demoValuation.valueRange}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-400 text-sm">AI Confidence</p>
                      <p className="text-emerald-400 font-bold">{demoValuation.confidence}%</p>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${demoValuation.confidence}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-emerald-400">
                    <Shield className="w-4 h-4" />
                    <span>Based on 847 recent sales</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform makes selling your devices easier and more profitable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Discover Your Device&apos;s Value?
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of smart sellers who use DeviceValue AI to get the best prices for their devices.
            </p>
            <Link href={user ? '/upload' : '/signup'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span>DeviceValue AI</span>
          </div>
          <p>© 2024 DeviceValue AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

