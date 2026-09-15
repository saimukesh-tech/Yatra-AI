// Core trip-planning domain types. These model the shape a future backend
// API is expected to return, so services can be swapped from mock -> real
// without touching components.

export type InterestKey =
  | 'history'
  | 'food'
  | 'nature'
  | 'adventure'
  | 'shopping'
  | 'photography'
  | 'spiritual'
  | 'entertainment'

export interface InterestOption {
  key: InterestKey
  label: string
  icon: string // lucide icon name, resolved in InterestChip
}

export type SceneType =
  | 'mountain'
  | 'beach'
  | 'heritage'
  | 'backwaters'
  | 'desert'
  | 'hills'
  | 'temple'
  | 'city'
  | 'wildlife'

export interface Destination {
  id: string
  name: string
  state: string
  tagline: string
  categories: string[]
  sceneType: SceneType
  description: string
  bestFor: InterestKey[]
  avgDailyBudget: number
  popular?: boolean
}

export interface TripInput {
  destinationId: string
  destinationName: string
  budgetMin: number
  budgetMax: number
  durationDays: number
  durationNights: number
  interests: InterestKey[]
  constraints: string
  travelers: number
  startDate?: string
}

export const DEFAULT_TRIP_INPUT: TripInput = {
  destinationId: '',
  destinationName: '',
  budgetMin: 1500,
  budgetMax: 5000,
  durationDays: 2,
  durationNights: 1,
  interests: [],
  constraints: '',
  travelers: 2,
}
