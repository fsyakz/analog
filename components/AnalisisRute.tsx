'use client'

import { useRoute } from '@/contexts/KonteksRute'
import { BarChart3, TrendingUp, Clock, MapPin, Route, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RouteAnalytics() {
  const { locations, routeResult } = useRoute()

  if (!routeResult || locations.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8 text-neutral-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p>Hitung rute terlebih dahulu untuk melihat analisis lengkap</p>
        </div>
      </div>
    )
  }

  // Calculate analytics
  const avgDistancePerLeg = routeResult.totalDistance / (routeResult.locations.length - 1)
  const efficiency = calculateEfficiency(routeResult)
  const timePerKm = routeResult.estimatedTime / routeResult.totalDistance
  const longestLeg = findLongestLeg(routeResult)
  const shortestLeg = findShortestLeg(routeResult)

  function calculateEfficiency(route: any): number {
    // Simple efficiency calculation based on distance vs direct distance
    const directDistance = calculateDirectDistance(route.locations[0], route.locations[route.locations.length - 1])
    return Math.round((directDistance / route.totalDistance) * 100)
  }

  function calculateDirectDistance(loc1: any, loc2: any): number {
    const R = 6371
    const dLat = (loc2.coordinates.lat - loc1.coordinates.lat) * Math.PI / 180
    const dLng = (loc2.coordinates.lng - loc1.coordinates.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.coordinates.lat * Math.PI / 180) * Math.cos(loc2.coordinates.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  function findLongestLeg(route: any): {from: string, to: string, distance: number} {
    let maxDistance = 0
    let longestLeg = {from: '', to: '', distance: 0}
    
    for (let i = 0; i < route.locations.length - 1; i++) {
      const distance = calculateDirectDistance(route.locations[i], route.locations[i + 1])
      if (distance > maxDistance) {
        maxDistance = distance
        longestLeg = {
          from: route.locations[i].name,
          to: route.locations[i + 1].name,
          distance
        }
      }
    }
    
    return longestLeg
  }

  function findShortestLeg(route: any): {from: string, to: string, distance: number} {
    let minDistance = Infinity
    let shortestLeg = {from: '', to: '', distance: 0}
    
    for (let i = 0; i < route.locations.length - 1; i++) {
      const distance = calculateDirectDistance(route.locations[i], route.locations[i + 1])
      if (distance < minDistance) {
        minDistance = distance
        shortestLeg = {
          from: route.locations[i].name,
          to: route.locations[i + 1].name,
          distance
        }
      }
    }
    
    return shortestLeg
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Analisis Rute</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-beige-600" />
          <span className="text-sm text-neutral-600">Real-time Analytics</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200"
        >
          <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">{efficiency}%</div>
          <div className="text-sm text-neutral-600">Efisiensi Rute</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-gradient-to-br from-beige-50 to-beige-100 rounded-lg border border-beige-200"
        >
          <Route className="w-8 h-8 text-beige-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-beige-600">{avgDistancePerLeg.toFixed(2)} km</div>
          <div className="text-sm text-neutral-600">Rata-rata Jarak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200"
        >
          <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-600">{timePerKm.toFixed(1)} mnt/km</div>
          <div className="text-sm text-neutral-600">Waktu per KM</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 bg-gradient-to-br from-beige-50 to-beige-100 rounded-lg border border-beige-200"
        >
          <MapPin className="w-8 h-8 text-beige-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-beige-600">{routeResult.locations.length}</div>
          <div className="text-sm text-neutral-600">Total Titik</div>
        </motion.div>
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-6">
        {/* Route Segments Analysis */}
        <div className="p-4 bg-neutral-50 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-4">Analisis Segmen Rute</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Segmen Terpanjang</span>
                <TrendingUp className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-lg font-bold text-neutral-800">{longestLeg.distance.toFixed(2)} km</div>
              <div className="text-sm text-neutral-600">
                {longestLeg.from} → {longestLeg.to}
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Segmen Terpendek</span>
                <TrendingUp className="w-4 h-4 text-green-500 transform rotate-180" />
              </div>
              <div className="text-lg font-bold text-neutral-800">{shortestLeg.distance.toFixed(2)} km</div>
              <div className="text-sm text-neutral-600">
                {shortestLeg.from} → {shortestLeg.to}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="p-4 bg-neutral-50 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-4">Metrik Performa</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Total Waktu Perjalanan</span>
              <span className="font-medium text-neutral-800">{routeResult.estimatedTime} menit</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Kecepatan Rata-rata</span>
              <span className="font-medium text-neutral-800">{(routeResult.totalDistance / (routeResult.estimatedTime / 60)).toFixed(1)} km/jam</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Jumlah Segmen</span>
              <span className="font-medium text-neutral-800">{routeResult.locations.length - 1} segmen</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Efisiensi Waktu</span>
              <span className="font-medium text-primary-600">{efficiency}% optimal</span>
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg border border-primary-200">
          <h3 className="font-semibold text-neutral-800 mb-3">Saran Optimasi</h3>
          
          <div className="space-y-2">
            {efficiency < 80 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-beige-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-700">
                  Pertimbangkan untuk mengurutkan ulang lokasi untuk meningkatkan efisiensi rute
                </p>
              </div>
            )}
            
            {avgDistancePerLeg > 10 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-beige-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-700">
                  Rata-rata jarak antar lokasi cukup jauh, pertimbangkan waktu istirahat
                </p>
              </div>
            )}
            
            {timePerKm > 5 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-beige-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-700">
                  Waktu per km tinggi, mungkin ada kemacetan atau kondisi jalan sulit
                </p>
              </div>
            )}
            
            {efficiency >= 80 && avgDistancePerLeg <= 10 && timePerKm <= 5 && (
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-700">
                  Rute sudah optimal dengan efisiensi tinggi dan waktu tempuh reasonable
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
