'use client'

import { useRoute } from '@/contexts/RouteContext'
import { motion } from 'framer-motion'
import { MapPin, Plus, Clock } from 'lucide-react'

interface QuickLocation {
  id: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  category: string
}

const quickLocations: QuickLocation[] = [
  // Jakarta Pusat
  { id: 'jkt1', name: 'Monas', address: 'Jl. Medan Merdeka, Jakarta Pusat', coordinates: { lat: -6.1754, lng: 106.8272 }, category: 'Jakarta Pusat' },
  { id: 'jkt2', name: 'Bundaran HI', address: 'Jl. MH Thamrin, Jakarta Pusat', coordinates: { lat: -6.1944, lng: 106.8229 }, category: 'Jakarta Pusat' },
  
  // Jakarta Selatan
  { id: 'jkt3', name: 'Senayan City', address: 'Jl. Asia Afrika No.19, Jakarta Selatan', coordinates: { lat: -6.2187, lng: 106.8026 }, category: 'Jakarta Selatan' },
  
  // Bogor
  { id: 'bgr1', name: 'Kebun Raya Bogor', address: 'Jl. Ir. H. Juanda No.13, Bogor', coordinates: { lat: -6.5989, lng: 106.8060 }, category: 'Bogor' },
  
  // Bandung
  { id: 'bdg1', name: 'Gedung Sate', address: 'Jl. Diponegoro No.22, Bandung', coordinates: { lat: -6.8915, lng: 107.6107 }, category: 'Bandung' },
  
  // Tangerang
  { id: 'tng1', name: 'Bandara Soetta', address: 'Jl. Raya Bandara Soekarno-Hatta, Tangerang', coordinates: { lat: -6.1256, lng: 106.6558 }, category: 'Tangerang' }
]

export default function LocationQuickAdd() {
  const { addLocation, locations } = useRoute()

  const handleQuickAdd = (location: QuickLocation) => {
    // Check if location already exists
    const exists = locations.some(loc => 
      loc.name.toLowerCase() === location.name.toLowerCase()
    )
    
    if (!exists) {
      addLocation({
        id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: location.name,
        address: location.address,
        coordinates: location.coordinates
      })
    }
  }

  const categories = Array.from(new Set(quickLocations.map(loc => loc.category)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Lokasi Penting</h2>
        </div>
        <div className="text-sm text-neutral-600">
          {quickLocations.length} lokasi strategis
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-neutral-600 mb-4">
          Tambahkan lokasi-lokasi strategis di Jabodetabek & Jawa Barat
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary-600" />
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLocations
                .filter(loc => loc.category === category)
                .map((location) => {
                  const isAdded = locations.some(loc => 
                    loc.name.toLowerCase() === location.name.toLowerCase()
                  )
                  
                  return (
                    <motion.button
                      key={location.id}
                      onClick={() => handleQuickAdd(location)}
                      disabled={isAdded}
                      className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                        isAdded
                          ? 'bg-green-50 border-green-200 cursor-not-allowed'
                          : 'bg-white border-neutral-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                      whileHover={!isAdded ? { scale: 1.02 } : {}}
                      whileTap={!isAdded ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${
                            isAdded ? 'text-green-700' : 'text-neutral-800'
                          }`}>
                            {location.name}
                          </h4>
                          <p className={`text-xs mt-1 ${
                            isAdded ? 'text-green-600' : 'text-neutral-600'
                          }`}>
                            {location.address.length > 40 
                              ? location.address.substring(0, 40) + '...' 
                              : location.address
                            }
                          </p>
                        </div>
                        <Plus className={`w-4 h-4 flex-shrink-0 ml-2 ${
                          isAdded ? 'text-green-600' : 'text-primary-600'
                        }`} />
                      </div>
                      {isAdded && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          Sudah ditambahkan
                        </div>
                      )}
                    </motion.button>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-beige-50 rounded-lg border border-beige-200">
        <p className="text-sm text-beige-800">
          <strong>Tips:</strong> Pilih lokasi strategis untuk optimasi rute terbaik. Lokasi yang sudah ditambahkan akan ditandai dengan warna hijau.
        </p>
      </div>
    </motion.div>
  )
}
