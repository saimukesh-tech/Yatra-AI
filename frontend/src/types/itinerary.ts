import type { InterestKey, SceneType, TripInput } from './trip'

export interface Attraction {
  id: string
  destinationId: string
  name: string
  categories: InterestKey[]
  description: string
  durationMinutes: number
  cost: number
  sceneType: SceneType
  travelMinutesToNext: number
  distanceKmToNext: number
  bestSlot: 'morning' | 'afternoon' | 'evening'
}

export interface ItineraryStop {
  attraction: Attraction
  time: string // "09:00 AM"
  reason: string
}

export interface ItineraryDay {
  dayNumber: number
  label: string
  summary: string
  stops: ItineraryStop[]
}

export interface ItineraryScores {
  interestMatch: number // 0-100
  budgetFit: number // 0-100
  timeFit: number // 0-100
  routeEfficiency: number // 0-100
}

export interface ItineraryTotals {
  cost: number
  timeHours: number
  distanceKm: number
  placeCount: number
}

export interface Itinerary {
  id: string
  input: TripInput
  days: ItineraryDay[]
  totals: ItineraryTotals
  scores: ItineraryScores
  generatedAt: string
}

export type ConstraintStatus = 'ok' | 'warning' | 'exceeded'

export interface ConstraintCheckItem {
  key: 'budget' | 'time' | 'interest' | 'route'
  label: string
  status: ConstraintStatus
  detail: string
  actualLabel: string
  targetLabel: string
  percent: number
}

export interface SavedTrip {
  itinerary: Itinerary
  savedAt: string
  groupMatched?: boolean
}
