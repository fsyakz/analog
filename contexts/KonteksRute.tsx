'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

interface Location {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface RouteResult {
  locations: Location[]
  optimizedOrder: string[]
  totalDistance: number
  estimatedTime: number
}

interface RouteState {
  locations: Location[]
  routeResult: RouteResult | null
  isCalculating: boolean
  selectedStartLocation: string | null
}

type RouteAction =
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'SET_LOCATIONS'; payload: Location[] }
  | { type: 'CALCULATE_ROUTE_START' }
  | { type: 'CALCULATE_ROUTE_SUCCESS'; payload: RouteResult }
  | { type: 'CALCULATE_ROUTE_ERROR' }
  | { type: 'CLEAR_ROUTE' }
  | { type: 'SET_START_LOCATION'; payload: string }

const initialState: RouteState = {
  locations: [],
  routeResult: null,
  isCalculating: false,
  selectedStartLocation: null,
}

function routeReducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
      }
    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(loc => loc.id !== action.payload),
        routeResult: state.routeResult ? {
          ...state.routeResult,
          locations: state.routeResult.locations.filter(loc => loc.id !== action.payload)
        } : null,
      }
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
      }
    case 'CALCULATE_ROUTE_START':
      return {
        ...state,
        isCalculating: true,
      }
    case 'CALCULATE_ROUTE_SUCCESS':
      return {
        ...state,
        isCalculating: false,
        routeResult: action.payload,
      }
    case 'CALCULATE_ROUTE_ERROR':
      return {
        ...state,
        isCalculating: false,
      }
    case 'CLEAR_ROUTE':
      return {
        ...state,
        routeResult: null,
      }
    case 'SET_START_LOCATION':
      return {
        ...state,
        selectedStartLocation: action.payload,
      }
    default:
      return state
  }
}

const RouteContext = createContext<{
  state: RouteState
  addLocation: (location: Location) => void
  removeLocation: (id: string) => void
  calculateRoute: () => Promise<void>
  clearRoute: () => void
  selectStartLocation: (id: string) => void
} | null>(null)

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(routeReducer, initialState)

  // Load sample data on mount
  useEffect(() => {
    const sampleLocations: Location[] = [
      // Jakarta Pusat
      {
        id: '1',
        name: 'Monas',
        address: 'Jl. Medan Merdeka, Gambir, Jakarta Pusat',
        coordinates: { lat: -6.1753924, lng: 106.8271528 }
      },
      {
        id: '2',
        name: 'Bundaran HI',
        address: 'Jl. MH Thamrin, Menteng, Jakarta Pusat',
        coordinates: { lat: -6.1944, lng: 106.8229 }
      },
      {
        id: '3',
        name: 'Grand Indonesia',
        address: 'Jl. MH Thamrin No.1, Jakarta Pusat',
        coordinates: { lat: -6.1950, lng: 106.8195 }
      },
      // Jakarta Selatan
      {
        id: '4',
        name: 'Senayan City',
        address: 'Jl. Asia Afrika No.19, Senayan, Jakarta Selatan',
        coordinates: { lat: -6.2187, lng: 106.8026 }
      },
      {
        id: '5',
        name: 'Pondok Indah Mall',
        address: 'Jl. Metro Pondok Indah, Jakarta Selatan',
        coordinates: { lat: -6.2625, lng: 106.7816 }
      },
      // Bogor
      {
        id: '6',
        name: 'Kebun Raya Bogor',
        address: 'Jl. Ir. H. Juanda No.13, Bogor',
        coordinates: { lat: -6.5989, lng: 106.8060 }
      },
      // Bandung
      {
        id: '7',
        name: 'Gedung Sate',
        address: 'Jl. Diponegoro No.22, Bandung',
        coordinates: { lat: -6.8915, lng: 107.6107 }
      },
      // Tangerang
      {
        id: '8',
        name: 'Bandara Soetta',
        address: 'Jl. Raya Bandara Soekarno-Hatta, Tangerang',
        coordinates: { lat: -6.1256, lng: 106.6558 }
      }
    ]
    
    dispatch({ type: 'SET_LOCATIONS', payload: sampleLocations })
  }, [])

  const calculateDistance = (coord1: {lat: number, lng: number}, coord2: {lat: number, lng: number}): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const greedyNearestNeighbor = (locations: Location[]): Location[] => {
    if (locations.length === 0) return []
    
    const unvisited = [...locations]
    const route: Location[] = []
    
    // Start from the first location or selected start location
    let current = state.selectedStartLocation 
      ? unvisited.find(loc => loc.id === state.selectedStartLocation) || unvisited[0]
      : unvisited[0]
    
    route.push(current)
    unvisited.splice(unvisited.indexOf(current), 1)
    
    while (unvisited.length > 0) {
      let nearest = unvisited[0]
      let minDistance = calculateDistance(current.coordinates, nearest.coordinates)
      
      for (let i = 1; i < unvisited.length; i++) {
        const distance = calculateDistance(current.coordinates, unvisited[i].coordinates)
        if (distance < minDistance) {
          minDistance = distance
          nearest = unvisited[i]
        }
      }
      
      route.push(nearest)
      current = nearest
      unvisited.splice(unvisited.indexOf(nearest), 1)
    }
    
    return route
  }

  const addLocation = (location: Location) => {
    dispatch({ type: 'ADD_LOCATION', payload: location })
  }

  const removeLocation = (id: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: id })
  }

  const calculateRoute = async () => {
    dispatch({ type: 'CALCULATE_ROUTE_START' })
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const optimizedRoute = greedyNearestNeighbor(state.locations)
      const totalDistance = optimizedRoute.reduce((sum, loc, index) => {
        if (index === 0) return 0
        return sum + calculateDistance(optimizedRoute[index - 1].coordinates, loc.coordinates)
      }, 0)
      
      const estimatedTime = Math.round(totalDistance * 2) // Assume 30 km/h average speed
      
      dispatch({
        type: 'CALCULATE_ROUTE_SUCCESS',
        payload: {
          locations: optimizedRoute,
          optimizedOrder: optimizedRoute.map(loc => loc.id),
          totalDistance: Math.round(totalDistance * 100) / 100,
          estimatedTime,
        },
      })
    } catch (error) {
      console.error('Route calculation failed:', error)
      dispatch({ type: 'CALCULATE_ROUTE_ERROR' })
    }
  }

  const clearRoute = () => {
    dispatch({ type: 'CLEAR_ROUTE' })
  }

  const selectStartLocation = (id: string) => {
    dispatch({ type: 'SET_START_LOCATION', payload: id })
  }

  return (
    <RouteContext.Provider
      value={{
        state,
        addLocation,
        removeLocation,
        calculateRoute,
        clearRoute,
        selectStartLocation,
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  
  return {
    locations: context.state.locations,
    routeResult: context.state.routeResult,
    isCalculating: context.state.isCalculating,
    selectedStartLocation: context.state.selectedStartLocation,
    addLocation: context.addLocation,
    removeLocation: context.removeLocation,
    calculateRoute: context.calculateRoute,
    clearRoute: context.clearRoute,
    selectStartLocation: context.selectStartLocation,
  }
}
