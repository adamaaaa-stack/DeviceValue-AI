import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeviceValue AI - Know Your Device Worth',
  description: 'AI-powered device valuation. Upload photos, get instant value estimates, and sell with confidence.',
  keywords: 'device valuation, phone value, sell phone, AI pricing, gadget worth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <AuthProvider>
          <div className="relative">
            {/* Background effects */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
            </div>

            {/* Main content wrapper */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

