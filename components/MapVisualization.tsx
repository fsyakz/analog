'use client'

import { useEffect, useRef } from 'react'
import { MapPin, Navigation, Route } from 'lucide-react'
import { useRoute } from '@/contexts/RouteContext'
import { motion } from 'framer-motion'

export default function MapVisualization() {
  const { locations, routeResult, selectedLocation } = useRoute()
  const mapRef = useRef<HTMLDivElement>(null)

  // Simple SVG Map Visualization (placeholder for real map)
  const renderSVGMap = () => {
    const width = 600
    const height = 400
    const padding = 40

    // Convert coordinates to SVG coordinates
    const minX = Math.min(...locations.map(l => l.coordinates.lng))
    const maxX = Math.max(...locations.map(l => l.coordinates.lng))
    const minY = Math.min(...locations.map(l => l.coordinates.lat))
    const maxY = Math.max(...locations.map(l => l.coordinates.lat))

    const xScale = (lng: number) => 
      ((lng - minX) / (maxX - minX)) * (width - 2 * padding) + padding
    const yScale = (lat: number) => 
      height - (((lat - minY) / (maxY - minY)) * (height - 2 * padding) + padding)

    const routePath = routeResult ? 
      routeResult.locations.map((loc, index) => {
        const x = xScale(loc.coordinates.lng)
        const y = yScale(loc.coordinates.lat)
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      }).join(' ') : null

    return (
      <svg width={width} height={height} className="w-full h-full">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Route Path */}
        {routePath && (
          <motion.path
            d={routePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}

        {/* Location Points */}
        {locations.map((location, index) => {
          const x = xScale(location.coordinates.lng)
          const y = yScale(location.coordinates.lat)
          const isSelected = selectedLocation?.id === location.id
          const routeIndex = routeResult?.optimizedOrder.indexOf(location.id)
          
          return (
            <g key={location.id}>
              {/* Location Circle */}
              <motion.circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : 8}
                fill={routeIndex !== undefined ? '#22c55e' : '#eab308'}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
              
              {/* Route Number */}
              {routeIndex !== undefined && (
                <motion.text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {routeIndex + 1}
                </motion.text>
              )}
              
              {/* Location Label */}
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                fill="#374151"
                fontSize="12"
                className="pointer-events-none"
              >
                {location.name.length > 15 ? location.name.substring(0, 15) + '...' : location.name}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Visualisasi Rute</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
            <span className="text-sm text-neutral-600">Lokasi Aktif</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-beige-600 rounded-full"></div>
            <span className="text-sm text-neutral-600">Belum Dikunjungi</span>
          </div>
        </div>
      </div>

      <div 
        ref={mapRef}
        className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
        style={{ height: '400px' }}
      >
        {locations.length > 0 ? (
          renderSVGMap()
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p>Belum ada lokasi untuk divisualisasikan</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors">
            <Navigation className="w-4 h-4 text-neutral-600" />
          </button>
          <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors">
            <Route className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
        
        <div className="text-sm text-neutral-600">
          {locations.length} lokasi • {routeResult ? `${routeResult.totalDistance}km` : 'Belum dihitung'}
        </div>
      </div>
    </div>
  )
}
