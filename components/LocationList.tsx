'use client'

import { useRoute } from '@/contexts/RouteContext'
import { MapPin, Trash2, Navigation, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LocationList() {
  const { locations, removeLocation, selectLocation, selectedLocation, routeResult } = useRoute()

  const getRoutePosition = (locationId: string) => {
    if (!routeResult) return null
    return routeResult.optimizedOrder.indexOf(locationId) + 1
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Daftar Lokasi</h2>
        </div>
        
        <div className="text-sm text-neutral-600">
          {locations.length} lokasi
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
          <p className="text-lg font-medium mb-2">Belum ada lokasi</p>
          <p className="text-sm">Tambah lokasi terlebih dahulu untuk memulai optimasi rute</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {locations.map((location, index) => {
            const routePosition = getRoutePosition(location.id)
            const isSelected = selectedLocation?.id === location.id
            
            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
                onClick={() => selectLocation(location)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-neutral-800">{location.name}</h3>
                      {routePosition && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-beige-600" />
                          <span className="text-sm font-medium text-beige-600">
                            #{routePosition}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {location.address && (
                      <p className="text-sm text-neutral-600 mb-2">{location.address}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <span>Lat: {location.coordinates.lat.toFixed(6)}</span>
                      <span>Lng: {location.coordinates.lng.toFixed(6)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isSelected && (
                      <Navigation className="w-5 h-5 text-primary-600" />
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeLocation(location.id)
                      }}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-neutral-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {routeResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg border border-primary-200"
        >
          <h3 className="font-semibold text-neutral-800 mb-3">Ringkasan Rute Optimal</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {routeResult.locations.length}
              </div>
              <div className="text-sm text-neutral-600">Lokasi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-beige-600">
                {routeResult.totalDistance}km
              </div>
              <div className="text-sm text-neutral-600">Total Jarak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {routeResult.estimatedTime}m
              </div>
              <div className="text-sm text-neutral-600">Estimasi</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
