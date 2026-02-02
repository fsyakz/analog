'use client'

import { useAuth } from '@/contexts/KonteksAutentikasi'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogIn } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if already on auth page
    if (!isLoading && !user && pathname !== '/auth') {
      router.push('/auth')
    }
  }, [user, isLoading, router, pathname])

  // If on auth page, don't show protected route content
  if (pathname === '/auth') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Memeriksa autentikasi...</p>
        </motion.div>
      </div>
    )
  }

  if (!user && pathname !== '/auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">
            Akses Terbatas
          </h1>
          <p className="text-neutral-600 mb-6">
            Anda harus login untuk mengakses halaman ini. Silakan masuk atau daftar terlebih dahulu.
          </p>
          <Link 
            href="/auth"
            className="btn-primary inline-flex items-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login Sekarang
          </Link>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
