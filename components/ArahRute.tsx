'use client'

import { useState } from 'react'
import { useRoute } from '@/contexts/KonteksRute'
import { Navigation, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RouteDirections() {
  const { routeResult, locations } = useRoute()
  const [selectedDirections, setSelectedDirections] = useState<number | null>(null)

  if (!routeResult) {
    return (
      <div className="card">
        <div className="text-center py-8 text-neutral-500">
          <Navigation className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p>Hitung rute terlebih dahulu untuk melihat arah dan petunjuk</p>
        </div>
      </div>
    )
  }

  const generateDirections = (from: any, to: any, index: number) => {
    const distance = calculateDistance(from.coordinates, to.coordinates)
    const directions = [
      `Dari ${from.name}, ambil arah ${getDirection(from.coordinates, to.coordinates)}`,
      `Lanjutkan sejauh ${distance.toFixed(2)} km`,
      `Anda akan tiba di ${to.name}`,
      `Perkiraan waktu: ${Math.round(distance * 2)} menit`
    ]
    
    return directions
  }

  const getDirection = (from: {lat: number, lng: number}, to: {lat: number, lng: number}) => {
    const dLng = to.lng - from.lng
    const dLat = to.lat - from.lat
    
    if (Math.abs(dLng) > Math.abs(dLat)) {
      return dLng > 0 ? 'timur' : 'barat'
    } else {
      return dLat > 0 ? 'utara' : 'selatan'
    }
  }

  const calculateDistance = (coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number => {
    const R = 6371
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const openGoogleMaps = (location: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`
    window.open(url, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Navigation className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Arah & Petunjuk</h2>
        </div>
        
        <div className="text-sm text-neutral-600">
          {routeResult.locations.length} titik
        </div>
      </div>

      <div className="space-y-4">
        {routeResult.locations.map((location, index) => {
          const isLast = index === routeResult.locations.length - 1
          const nextLocation = isLast ? null : routeResult.locations[index + 1]
          
          return (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Location Card */}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg border border-primary-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">{location.name}</h3>
                      {location.address && (
                        <p className="text-sm text-neutral-600">{location.address}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openGoogleMaps(location)}
                    className="p-2 rounded-lg hover:bg-white transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                  </button>
                </div>

                {/* Directions to next location */}
                {nextLocation && (
                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => setSelectedDirections(selectedDirections === index ? null : index)}
                        className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Arah ke lokasi berikutnya</span>
                      </button>
                      
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span>{calculateDistance(location.coordinates, nextLocation.coordinates).toFixed(2)} km</span>
                      </div>
                    </div>

                    {selectedDirections === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-white rounded-lg border border-neutral-200"
                      >
                        <div className="space-y-2">
                          {generateDirections(location, nextLocation, index).map((direction, dirIndex) => (
                            <div key={dirIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-neutral-700">{direction}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-3 flex items-center space-x-2 text-sm text-beige-600">
                          <Clock className="w-4 h-4" />
                          <span>Estimasi waktu: {Math.round(calculateDistance(location.coordinates, nextLocation.coordinates) * 2)} menit</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Connection Line */}
              {!isLast && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-primary-300 to-beige-300"></div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-primary-100 to-beige-100 rounded-lg border border-primary-200"
      >
        <h3 className="font-semibold text-neutral-800 mb-3">Ringkasan Perjalanan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary-600">
              {routeResult.locations.length}
            </div>
            <div className="text-sm text-neutral-600">Lokasi</div>
          </div>
          <div>
            <div className="text-lg font-bold text-beige-600">
              {routeResult.totalDistance} km
            </div>
            <div className="text-sm text-neutral-600">Total Jarak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary-600">
              {routeResult.estimatedTime} menit
            </div>
            <div className="text-sm text-neutral-600">Estimasi Waktu</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
