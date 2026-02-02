'use client'

import { useState } from 'react'
import { useRoute } from '@/contexts/RouteContext'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, X, Navigation, Search, Crosshair } from 'lucide-react'

export default function ImprovedLocationForm() {
  const { addLocation } = useRoute()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: ''
  })
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Common location suggestions
  const locationSuggestions = [
    'Monas, Jakarta',
    'Bundaran HI, Jakarta',
    'Grand Indonesia, Jakarta',
    'Senayan City, Jakarta',
    'Kebun Raya Bogor',
    'Gedung Sate, Bandung',
    'Bandara Soekarno-Hatta',
    'Pondok Indah Mall, Jakarta',
    'Universitas Indonesia, Depok',
    'Trans Studio Bandung'
  ]

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser ini')
      return
    }

    setIsGettingLocation(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          name: prev.name || 'Lokasi Saya',
          address: prev.address || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
        }))
        setIsGettingLocation(false)
      },
      (error) => {
        setError('Tidak bisa mendapatkan lokasi. Pastikan GPS diaktifkan.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSearchAddress = async (address: string) => {
    if (!address) return

    try {
      // Using Nominatim API for geocoding (free OpenStreetMap service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
        {
          headers: {
            'User-Agent': 'RouteOptimize App'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const result = data[0]
          setFormData(prev => ({
            ...prev,
            lat: parseFloat(result.lat).toFixed(6),
            lng: parseFloat(result.lon).toFixed(6),
            address: result.display_name
          }))
          setError('')
        } else {
          setError('Alamat tidak ditemukan')
        }
      }
    } catch (err) {
      setError('Gagal mencari alamat. Coba lagi.')
    }
  }

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
    setSuggestions([])
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    
    // Show suggestions for name field
    if (field === 'name' && value.length > 2) {
      const filtered = locationSuggestions.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 3))
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, name: suggestion }))
    setSuggestions([])
    handleSearchAddress(suggestion)
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
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

              {/* Name Field with Suggestions */}
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nama Lokasi
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input pl-10"
                    placeholder="Masukkan nama lokasi"
                    required
                  />
                  {formData.name && (
                    <button
                      type="button"
                      onClick={() => handleSearchAddress(formData.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-600"
                      title="Cari alamat"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Search className="w-3 h-3 text-neutral-400" />
                          <span>{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              {/* Coordinates Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => handleInputChange('lat', e.target.value)}
                    className="input"
                    placeholder="-6.2088"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => handleInputChange('lng', e.target.value)}
                    className="input"
                    placeholder="106.8456"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="flex-1 btn-secondary flex items-center justify-center"
                >
                  {isGettingLocation ? (
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Crosshair className="w-4 h-4 mr-2" />
                  )}
                  {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Gunakan Lokasi Saya'}
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Lokasi
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
