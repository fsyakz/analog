'use client'

import { useRoute } from '@/contexts/RouteContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Navigation, BarChart3, Menu, X, MapPin, TrendingUp, Clock, Route, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import LocationForm from '@/components/LocationForm'
import LocationList from '@/components/LocationList'
import MapVisualization from '@/components/MapVisualization'
import RouteDirections from '@/components/RouteDirections'
import RouteAnalytics from '@/components/RouteAnalytics'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function HomePage() {
  const { locations, routeResult, isCalculating, calculateRoute, clearRoute } = useRoute()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCalculateRoute = async () => {
    try {
      await calculateRoute()
    } catch (error) {
      console.error('Route calculation failed:', error)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-primary-50 to-beige-100">
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Navigation className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-beige-600 bg-clip-text text-transparent">
                  RouteOptimize
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#dashboard" className="nav-link">Dashboard</Link>
                <Link href="#locations" className="nav-link">Lokasi</Link>
                <Link href="#visualization" className="nav-link">Visualisasi</Link>
                <Link href="#directions" className="nav-link">Arah</Link>
                <Link href="#analytics" className="nav-link">Analisis</Link>
                <Link href="#results" className="nav-link">Hasil</Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span className="text-sm text-neutral-600">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden glass border-t border-white/20"
            >
              <div className="px-4 py-2 space-y-1">
                <Link href="#dashboard" className="block py-2 nav-link">Dashboard</Link>
                <Link href="#locations" className="block py-2 nav-link">Lokasi</Link>
                <Link href="#visualization" className="block py-2 nav-link">Visualisasi</Link>
                <Link href="#directions" className="block py-2 nav-link">Arah</Link>
                <Link href="#analytics" className="block py-2 nav-link">Analisis</Link>
                <Link href="#results" className="block py-2 nav-link">Hasil</Link>
                <div className="flex items-center justify-between py-2 border-t border-neutral-200">
                  <span className="text-sm text-neutral-600">{user?.name || user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </nav>

      {/* Hero Section */}
      <section id="dashboard" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-beige-600 bg-clip-text text-transparent">
              Optimasi Rute Distribusi Modern
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Platform canggih untuk mengoptimalkan rute pengiriman dengan algoritma Greedy Nearest Neighbor 
              dan visualisasi real-time yang interaktif.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-600">{locations.length}</div>
              <div className="text-neutral-600">Total Lokasi</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <TrendingUp className="w-8 h-8 text-beige-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-beige-600">99%</div>
              <div className="text-neutral-600">Akurasi</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-600">&lt;1s</div>
              <div className="text-neutral-600">Proses</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <Route className="w-8 h-8 text-beige-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-beige-600">
                {routeResult ? `${routeResult.totalDistance}km` : '-'}
              </div>
              <div className="text-neutral-600">Total Jarak</div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating || locations.length < 2}
              className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="w-5 h-5" />
              <span>{isCalculating ? 'Menghitung...' : 'Hitung Rute Optimal'}</span>
            </button>
            <button
              onClick={clearRoute}
              disabled={!routeResult}
              className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Reset Hasil</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Location Management */}
            <div className="space-y-8">
              <div id="locations">
                <LocationForm />
              </div>
              <div>
                <LocationList />
              </div>
            </div>

            {/* Right Column - Visualization and Directions */}
            <div className="space-y-8">
              <div id="visualization">
                <MapVisualization />
              </div>
              <div id="directions">
                <RouteDirections />
              </div>
              <div id="analytics">
                <RouteAnalytics />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {routeResult && (
        <section id="results" className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-dark text-white"
            >
              <h2 className="text-3xl font-bold mb-6">Hasil Optimasi Rute</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-beige-300">{routeResult.locations.length}</div>
                  <div className="text-beige-200">Lokasi Dikunjungi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-beige-300">{routeResult.totalDistance} km</div>
                  <div className="text-beige-200">Total Jarak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-beige-300">{routeResult.estimatedTime} menit</div>
                  <div className="text-beige-200">Estimasi Waktu</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-beige-200">Urutan Kunjungan Optimal</h3>
                <div className="space-y-2">
                  {routeResult.locations.map((location, index) => (
                    <div key={location.id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                      <div className="w-8 h-8 bg-beige-500 text-primary-900 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-beige-300">{location.address}</div>
                      </div>
                      {index < routeResult.locations.length - 1 && (
                        <div className="text-sm text-beige-300">
                          {Math.round(
                            calculateDistance(
                              location.coordinates,
                              routeResult.locations[index + 1].coordinates
                            ) * 100
                          ) / 100} km
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      </div>
    </ProtectedRoute>
  )
}

// Helper function for distance calculation
function calculateDistance(coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number {
  const R = 6371 // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
