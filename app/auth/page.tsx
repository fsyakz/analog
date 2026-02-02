'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { login, register, isLoading, user } = useAuth()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      let success = false
      
      if (isLogin) {
        success = await login(formData.email, formData.password)
        if (!success) {
          setError('Email atau password salah')
        }
      } else {
        success = await register(formData.email, formData.password, formData.name)
        if (!success) {
          setError('Registrasi gagal. Periksa kembali data Anda.')
        }
      }

      // If successful, the redirect will happen automatically from AuthContext
      if (!success) {
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  // If user is already logged in, don't show the auth page
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Anda Sudah Login</h2>
          <p className="text-neutral-600 mb-4">Mengalihkan ke dashboard...</p>
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-beige-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h1>
            <p className="text-neutral-600">
              {isLogin 
                ? 'Masuk ke akun RouteOptimize Anda' 
                : 'Daftar untuk mulai mengoptimalkan rute'
              }
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-neutral-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input pl-10"
                    placeholder="Masukkan nama lengkap"
                    required={!isLogin}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input pl-10"
                  placeholder="nama@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isSubmitting || isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />
              )}
              {isSubmitting || isLoading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          {/* Switch between login and register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({ email: '', password: '', name: '' })
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
