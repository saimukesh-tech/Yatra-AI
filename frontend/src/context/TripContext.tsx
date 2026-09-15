import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TripInput } from '@/types/trip'
import { DEFAULT_TRIP_INPUT } from '@/types/trip'
import type { Itinerary, SavedTrip } from '@/types/itinerary'
import type { TravelerGroup } from '@/types/traveler'
import type { TransportComparison } from '@/types/transport'
import type { OptimizationResult } from '@/services/itineraryService'

const STORAGE_KEY = 'yatraai_saved_trips_v1'

const loadSavedTrips = (): SavedTrip[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedTrip[]) : []
  } catch {
    return []
  }
}

interface TripContextValue {
  tripInput: TripInput
  setTripInput: React.Dispatch<React.SetStateAction<TripInput>>

  itinerary: Itinerary | null
  setItinerary: (itinerary: Itinerary | null) => void

  optimization: OptimizationResult | null
  setOptimization: (result: OptimizationResult | null) => void
  applyOptimization: () => void

  groups: TravelerGroup[]
  setGroups: (groups: TravelerGroup[]) => void
  selectedGroup: TravelerGroup | null
  selectGroup: (group: TravelerGroup | null) => void

  transport: TransportComparison | null
  setTransport: (t: TransportComparison | null) => void

  savedTrips: SavedTrip[]
  saveCurrentTrip: () => void
  isCurrentTripSaved: boolean
  removeSavedTrip: (itineraryId: string) => void

  resetFlow: () => void
}

const TripContext = createContext<TripContextValue | undefined>(undefined)

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripInput, setTripInput] = useState<TripInput>({ ...DEFAULT_TRIP_INPUT, travelers: 2 })
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null)
  const [groups, setGroups] = useState<TravelerGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<TravelerGroup | null>(null)
  const [transport, setTransport] = useState<TransportComparison | null>(null)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => loadSavedTrips())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTrips))
    } catch {
      // localStorage unavailable (private mode etc.) - fail silently, in-memory state still works
    }
  }, [savedTrips])

  const applyOptimization = () => {
    if (!optimization) return
    setItinerary(optimization.after)
    setOptimization(null)
  }

  const selectGroup = (group: TravelerGroup | null) => setSelectedGroup(group)

  const isCurrentTripSaved = useMemo(
    () => (itinerary ? savedTrips.some((t) => t.itinerary.id === itinerary.id) : false),
    [itinerary, savedTrips],
  )

  const saveCurrentTrip = () => {
    if (!itinerary) return
    setSavedTrips((prev) => {
      if (prev.some((t) => t.itinerary.id === itinerary.id)) return prev
      const entry: SavedTrip = {
        itinerary,
        savedAt: new Date().toISOString(),
        groupMatched: Boolean(selectedGroup),
      }
      return [entry, ...prev]
    })
  }

  const removeSavedTrip = (itineraryId: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.itinerary.id !== itineraryId))
  }

  const resetFlow = () => {
    setItinerary(null)
    setOptimization(null)
    setGroups([])
    setSelectedGroup(null)
    setTransport(null)
    setTripInput({ ...DEFAULT_TRIP_INPUT, travelers: 2 })
  }

  const value: TripContextValue = {
    tripInput,
    setTripInput,
    itinerary,
    setItinerary,
    optimization,
    setOptimization,
    applyOptimization,
    groups,
    setGroups,
    selectedGroup,
    selectGroup,
    transport,
    setTransport,
    savedTrips,
    saveCurrentTrip,
    isCurrentTripSaved,
    removeSavedTrip,
    resetFlow,
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTripContext must be used within TripProvider')
  return ctx
}
