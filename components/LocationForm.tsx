'use client'

import { useState } from 'react'
import { useRoute } from '@/contexts/RouteContext'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, X } from 'lucide-react'

export default function LocationForm() {
  const { addLocation } = useRoute()
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.lat || !formData.lng) {
      setError('Nama dan koordinat harus diisi')
      return
    }

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Koordinat tidak valid')
      return
    }
    
    const newLocation = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng }
    }
    
    addLocation(newLocation)
    
    // Reset form
    setFormData({ name: '', address: '', lat: '', lng: '' })
    setError('')
    setIsExpanded(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-neutral-800">Tambah Lokasi</h2>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-primary-100 hover:bg-primary-200 transition-colors"
        >
          {isExpanded ? <X className="w-5 h-5 text-primary-600" /> : <Plus className="w-5 h-5 text-primary-600" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nama Lokasi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  placeholder="Contoh: Kantor Pusat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input"
                  placeholder="Contoh: Jakarta Pusat"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    className="input"
                    placeholder="-6.2088"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    className="input"
                    placeholder="106.8456"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Lokasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false)
                    setFormData({ name: '', address: '', lat: '', lng: '' })
                    setError('')
                  }}
                  className="btn-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <div className="text-center py-4 text-neutral-500">
          <p className="text-sm">Klik tombol + untuk menambah lokasi baru</p>
        </div>
      )}
    </motion.div>
  )
}
