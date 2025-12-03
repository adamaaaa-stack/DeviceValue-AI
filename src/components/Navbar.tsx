'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { Smartphone, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 xl:px-12 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-2 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              DeviceValue AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  href="/upload" 
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Upload Device
                </Link>
                <Link 
                  href="/market" 
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Market
                </Link>
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{profile?.name || 'User'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="btn-primary text-sm py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass rounded-2xl mt-2 p-4"
          >
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.name || 'User'}</p>
                    <p className="text-sm text-slate-400">{profile?.email}</p>
                  </div>
                </div>
                <Link href="/upload" className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  Upload Device
                </Link>
                <Link href="/market" className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  Market
                </Link>
                <Link href="/dashboard" className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/settings" className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  Settings
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="text-red-400 hover:text-red-300 py-2 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" className="text-slate-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

