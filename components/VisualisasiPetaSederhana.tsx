'use client'

import { useRoute } from '@/contexts/KonteksRute'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

export default function SimpleMapVisualization() {
  const { locations, routeResult } = useRoute()

  if (locations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center py-8 text-neutral-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-lg font-medium mb-2">Peta Belum Aktif</p>
          <p className="text-sm">Tambahkan lokasi untuk melihat visualisasi</p>
        </div>
      </motion.div>
    )
  }

  // Calculate map bounds
  const lats = locations.map(loc => loc.coordinates.lat)
  const lngs = locations.map(loc => loc.coordinates.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  
  const padding = 0.5
  const mapBounds = {
    minLat: minLat - padding,
    maxLat: maxLat + padding,
    minLng: minLng - padding,
    maxLng: maxLng + padding
  }

  // Normalize coordinates to SVG viewBox
  const normalizeLat = (lat: number) => 
    ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100
  const normalizeLng = (lng: number) => 
    ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Visualisasi Peta</h2>
        </div>
      </div>

      {/* Simple SVG Map */}
      <div className="relative bg-gradient-to-br from-beige-50 to-primary-50 rounded-lg border border-primary-200 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-64 md:h-96"
          style={{ minHeight: '300px' }}
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Route Lines */}
          {routeResult && (
            <g>
              {routeResult.locations.map((location, index) => {
                if (index === 0) return null
                const prevLocation = routeResult.locations[index - 1]
                return (
                  <motion.line
                    key={`route-${index}`}
                    x1={normalizeLng(prevLocation.coordinates.lng)}
                    y1={normalizeLat(prevLocation.coordinates.lat)}
                    x2={normalizeLng(location.coordinates.lng)}
                    y2={normalizeLat(location.coordinates.lat)}
                    stroke="#059669"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                )
              })}
            </g>
          )}

          {/* Location Points */}
          {locations.map((location, index) => {
            const routeOrder = routeResult?.locations.findIndex(loc => loc.id === location.id)
            const x = normalizeLng(location.coordinates.lng)
            const y = normalizeLat(location.coordinates.lat)
            
            return (
              <g key={location.id}>
                {/* Connection to next point (if no route) */}
                {!routeResult && index < locations.length - 1 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={normalizeLng(locations[index + 1].coordinates.lng)}
                    y2={normalizeLat(locations[index + 1].coordinates.lat)}
                    stroke="#d97706"
                    strokeWidth="0.3"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                )}
                
                {/* Location marker */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={routeOrder !== undefined && routeOrder !== -1 ? "1.5" : "1"}
                  fill={routeOrder !== undefined && routeOrder !== -1 ? "#059669" : "#d97706"}
                  stroke="white"
                  strokeWidth="0.3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
                
                {/* Route order number */}
                {routeOrder !== undefined && routeOrder !== -1 && (
                  <motion.text
                    x={x}
                    y={y - 2}
                    textAnchor="middle"
                    fontSize="2"
                    fill="#059669"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {routeOrder + 1}
                  </motion.text>
                )}
                
                {/* Location name */}
                <motion.text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontSize="1.5"
                  fill="#374151"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {location.name.length > 10 ? location.name.substring(0, 10) + '...' : location.name}
                </motion.text>
              </g>
            )
          })}
        </svg>

        {/* Simple Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-neutral-200">
          <div className="text-xs font-medium text-neutral-700 mb-2">Legenda</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-beige-600 border border-white"></div>
              <span className="text-xs text-neutral-600">Lokasi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary-600 border border-white"></div>
              <span className="text-xs text-neutral-600">Rute Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Info */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-lg font-bold text-neutral-800">{locations.length}</div>
          <div className="text-xs text-neutral-600">Total Lokasi</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-lg font-bold text-neutral-800">
            {routeResult ? routeResult.locations.length : '-'}
          </div>
          <div className="text-xs text-neutral-600">Lokasi Ter-rute</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-lg font-bold text-neutral-800">
            {routeResult ? `${routeResult.totalDistance}km` : '-'}
          </div>
          <div className="text-xs text-neutral-600">Total Jarak</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-lg font-bold text-neutral-800">
            {routeResult ? `${routeResult.estimatedTime}m` : '-'}
          </div>
          <div className="text-xs text-neutral-600">Estimasi</div>
        </div>
      </div>
    </motion.div>
  )
}
