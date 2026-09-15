import type { InterestKey } from './trip'

export interface Traveler {
  id: string
  label: string
  destinationId: string
  interests: InterestKey[]
  startTime: string // "09:00"
  endTime: string // "18:00"
  budget: number
  durationDays: number
}

export interface CompatibilityBreakdown {
  destinationMatch: number
  interestMatch: number
  timeMatch: number
  budgetMatch: number
  overall: number
}

export interface TravelerGroup {
  id: string
  label: string
  travelerCount: number
  travelers: Traveler[]
  compatibility: CompatibilityBreakdown
  reasons: string[]
}
