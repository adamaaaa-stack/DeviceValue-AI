'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/AuthContext'
import { 
  User, Bell, Shield, LogOut, ChevronRight, 
  Loader2, Check, AlertCircle, Mail, Camera, Trash2
} from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    valuations: true,
    leaderboard: false,
    marketing: false
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (profile?.name) {
      setName(profile.name)
    }
  }, [user, profile, authLoading, router])

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty')
      return
    }

    setSaving(true)
    setError('')

    try {
      await updateProfile({ name: name.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-700">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.name?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-white font-medium">{profile?.name || 'Set your name'}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Name field */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">{user.email}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={saving || name === profile?.name}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'valuations', label: 'Valuation Alerts', desc: 'Get notified when market prices change' },
                { key: 'leaderboard', label: 'Leaderboard Updates', desc: 'When someone passes your rank' },
                { key: 'marketing', label: 'Marketing', desc: 'News and promotional content' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev]
                    }))}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-emerald-500'
                        : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors">
                <span className="text-white">Change Password</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors">
                <span className="text-white">Two-Factor Authentication</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 border-red-500/20"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Danger Zone</h2>

            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-red-500/10 rounded-xl transition-colors text-slate-300 hover:text-red-400"
              >
                <span className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-red-500/10 rounded-xl transition-colors text-slate-300 hover:text-red-400">
                <span className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

