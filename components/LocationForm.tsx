'use client'

import { useState } from 'react'
import { useRoute } from '@/contexts/RouteContext'
import { MapPin, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LocationForm() {
  const { addLocation } = useRoute()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.lat || !formData.lng) {
      return
    }

    addLocation({
      name: formData.name,
      address: formData.address,
      coordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      }
    })

    setFormData({ name: '', address: '', lat: '', lng: '' })
    setIsExpanded(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
          <h2 className="text-2xl font-bold text-neutral-800">Tambah Lokasi</h2>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-primary-100 hover:bg-primary-200 transition-colors"
        >
          {isExpanded ? <X className="w-5 h-5 text-primary-600" /> : <Plus className="w-5 h-5 text-primary-600" />}
        </button>
      </div>

      {isExpanded && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Nama Lokasi *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input"
                placeholder="Contoh: Toko ABC"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
                Alamat
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="input"
                placeholder="Contoh: Jakarta Pusat"
              />
            </div>

            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-neutral-700 mb-2">
                Latitude *
              </label>
              <input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => handleInputChange('lat', e.target.value)}
                className="input"
                placeholder="Contoh: -6.2088"
                required
              />
            </div>

            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-neutral-700 mb-2">
                Longitude *
              </label>
              <input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => handleInputChange('lng', e.target.value)}
                className="input"
                placeholder="Contoh: 106.8456"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              * Wajib diisi
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="btn-outline"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Lokasi</span>
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {!isExpanded && (
        <div className="text-center py-8 text-neutral-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p>Klik tombol + untuk menambah lokasi baru</p>
        </div>
      )}
    </motion.div>
  )
}
