'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Location {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  address?: string
}

export interface RouteResult {
  locations: Location[]
  totalDistance: number
  estimatedTime: number
  optimizedOrder: string[]
}

interface RouteContextType {
  locations: Location[]
  selectedLocation: Location | null
  routeResult: RouteResult | null
  isCalculating: boolean
  addLocation: (location: Omit<Location, 'id'>) => void
  removeLocation: (id: string) => void
  selectLocation: (location: Location) => void
  calculateRoute: () => Promise<void>
  clearRoute: () => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Default locations for demo
  React.useEffect(() => {
    const defaultLocations: Location[] = [
      {
        id: '1',
        name: 'Central Business District Jakarta',
        coordinates: { lat: -6.2088, lng: 106.8456 },
        address: 'Jakarta Pusat, Indonesia'
      },
      {
        id: '2',
        name: 'Menteng Business Center',
        coordinates: { lat: -6.1944, lng: 106.8229 },
        address: 'Menteng, Jakarta Pusat'
      },
      {
        id: '3',
        name: 'Senayan Business Park',
        coordinates: { lat: -6.2187, lng: 106.8025 },
        address: 'Senayan, Jakarta Pusat'
      },
      {
        id: '4',
        name: 'Thamrin Corporate Tower',
        coordinates: { lat: -6.1930, lng: 106.8228 },
        address: 'Thamrin, Jakarta Pusat'
      },
      {
        id: '5',
        name: 'Sudirman Office Tower',
        coordinates: { lat: -6.2088, lng: 106.8196 },
        address: 'Sudirman, Jakarta Pusat'
      }
    ]
    setLocations(defaultLocations)
  }, [])

  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: Date.now().toString()
    }
    setLocations(prev => [...prev, newLocation])
  }

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id))
    if (selectedLocation?.id === id) {
      setSelectedLocation(null)
    }
  }

  const selectLocation = (location: Location) => {
    setSelectedLocation(location)
  }

  const calculateRoute = async () => {
    if (locations.length < 2) {
      throw new Error('Minimal 2 lokasi diperlukan untuk menghitung rute')
    }

    setIsCalculating(true)
    
    try {
      // Simulate API call for route calculation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Greedy Nearest Neighbor Algorithm
      const optimizedOrder = greedyNearestNeighbor(locations)
      const totalDistance = calculateTotalDistance(optimizedOrder)
      const estimatedTime = Math.round(totalDistance * 2) // 2 minutes per km
      
      setRouteResult({
        locations: optimizedOrder,
        totalDistance,
        estimatedTime,
        optimizedOrder: optimizedOrder.map(loc => loc.id)
      })
    } catch (error) {
      throw new Error('Gagal menghitung rute. Silakan coba lagi.')
    } finally {
      setIsCalculating(false)
    }
  }

  const clearRoute = () => {
    setRouteResult(null)
    setSelectedLocation(null)
  }

  // Greedy Nearest Neighbor Algorithm
  const greedyNearestNeighbor = (locations: Location[]): Location[] => {
    if (locations.length === 0) return []
    
    const unvisited = [...locations]
    const route: Location[] = []
    let current = unvisited.shift()!
    route.push(current)
    
    while (unvisited.length > 0) {
      let nearestIndex = 0
      let nearestDistance = calculateDistance(current, unvisited[0])
      
      for (let i = 1; i < unvisited.length; i++) {
        const distance = calculateDistance(current, unvisited[i])
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = i
        }
      }
      
      current = unvisited.splice(nearestIndex, 1)[0]
      route.push(current)
    }
    
    return route
  }

  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (loc2.coordinates.lat - loc1.coordinates.lat) * Math.PI / 180
    const dLng = (loc2.coordinates.lng - loc1.coordinates.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.coordinates.lat * Math.PI / 180) * Math.cos(loc2.coordinates.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateTotalDistance = (route: Location[]): number => {
    let total = 0
    for (let i = 0; i < route.length - 1; i++) {
      total += calculateDistance(route[i], route[i + 1])
    }
    return Math.round(total * 100) / 100
  }

  return (
    <RouteContext.Provider value={{
      locations,
      selectedLocation,
      routeResult,
      isCalculating,
      addLocation,
      removeLocation,
      selectLocation,
      calculateRoute,
      clearRoute
    }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  return context
}
