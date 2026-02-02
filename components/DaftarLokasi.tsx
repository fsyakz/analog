'use client'

import { useRoute } from '@/contexts/KonteksRute'
import { motion } from 'framer-motion'
import { MapPin, Trash2, Play, CheckCircle } from 'lucide-react'

export default function LocationList() {
  const { locations, removeLocation, selectStartLocation, selectedStartLocation, routeResult } = useRoute()

  if (locations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center py-8 text-neutral-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-lg font-medium mb-2">Belum ada lokasi</p>
          <p className="text-sm">Tambahkan lokasi untuk memulai optimasi rute</p>
        </div>
      </motion.div>
    )
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

      {/* Route Summary */}
      {routeResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg border border-primary-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-primary-800">Ringkasan Rute</h3>
            <CheckCircle className="w-5 h-5 text-primary-600" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Total Jarak:</span>
              <span className="ml-2 font-medium text-primary-700">{routeResult.totalDistance} km</span>
            </div>
            <div>
              <span className="text-neutral-600">Estimasi Waktu:</span>
              <span className="ml-2 font-medium text-primary-700">{routeResult.estimatedTime} menit</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Location List */}
      <div className="space-y-3">
        {locations.map((location, index) => {
          const routeOrder = routeResult?.locations.findIndex(loc => loc.id === location.id)
          const isStartLocation = selectedStartLocation === location.id
          
          return (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isStartLocation 
                  ? 'bg-primary-50 border-primary-300' 
                  : 'bg-white border-neutral-200 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {routeOrder !== undefined && routeOrder !== -1 && (
                      <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {routeOrder + 1}
                      </div>
                    )}
                    <h3 className="font-semibold text-neutral-800">{location.name}</h3>
                    {isStartLocation && (
                      <div className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                        Titik Awal
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-2">{location.address}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}</span>
                    </div>
                    {routeOrder !== undefined && routeOrder !== -1 && (
                      <div className="text-primary-600 font-medium">
                        Urutan #{routeOrder + 1}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!isStartLocation && (
                    <button
                      onClick={() => selectStartLocation(location.id)}
                      className="p-2 rounded-lg bg-beige-100 hover:bg-beige-200 transition-colors group"
                      title="Jadikan titik awal"
                    >
                      <Play className="w-4 h-4 text-beige-600 group-hover:text-beige-700" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeLocation(location.id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors group"
                    title="Hapus lokasi"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {selectedStartLocation ? (
              <span className="text-primary-600 font-medium">
                Titik awal telah dipilih
              </span>
            ) : (
              <span>Pilih titik awal untuk optimasi yang lebih baik</span>
            )}
          </div>
          
          {selectedStartLocation && (
            <button
              onClick={() => selectStartLocation('')}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Reset titik awal
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
