'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/AuthContext'
import { 
  Smartphone, TrendingUp, Calendar, ChevronRight, 
  Plus, Settings, Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Device {
  id: string
  brand: string
  model: string
  ai_value_min: number
  ai_value_max: number
  confidence: number
  created_at: string
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setLoading(true)
      try {
        const devicesRes = await fetch(`/api/device/history?userId=${user.id}`)
        const devicesData = await devicesRes.json()
        if (devicesData.devices) {
          setDevices(devicesData.devices)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  const totalValue = devices.reduce((acc, d) => acc + ((d.ai_value_min + d.ai_value_max) / 2), 0)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white">
                {profile?.name?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {profile?.name || 'Welcome!'}
                </h1>
                <p className="text-slate-400">{user.email}</p>
              </div>

              {/* Settings link */}
              <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">{devices.length}</p>
              <p className="text-sm text-slate-400">Devices Valuated</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${Math.round(totalValue).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Total Value</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {devices.length > 0 
                  ? new Date(devices[0]?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'N/A'
                }
              </p>
              <p className="text-sm text-slate-400">Last Valuation</p>
            </motion.div>
          </div>

          {/* Devices List */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">My Devices</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : devices.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {devices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card card-hover p-5 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {device.brand} {device.model}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Valuated {new Date(device.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">
                      ${device.ai_value_min?.toLocaleString()} - ${device.ai_value_max?.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400">
                      {device.confidence}% confidence
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </motion.div>
              ))}
              
              <div className="mt-6 text-center">
                <Link href="/upload">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Device
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No devices yet</h3>
              <p className="text-slate-400 mb-6">
                Start valuating devices to track them here!
              </p>
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Device
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
