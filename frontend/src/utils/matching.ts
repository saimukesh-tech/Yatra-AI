import type { InterestKey } from '@/types/trip'
import type { Traveler, CompatibilityBreakdown } from '@/types/traveler'

// Modular, replaceable scoring logic for AI Group Travel Match.
// Weighted: Interest 40%, Time 30%, Destination 20%, Budget 10%
// (see product spec §37). Every function here is pure and takes only
// primitive/plain-object inputs so it can later be swapped for a real
// backend matching service without touching UI code.

const WEIGHTS = {
  interest: 0.4,
  time: 0.3,
  destination: 0.2,
  budget: 0.1,
}

export const interestSimilarity = (a: InterestKey[], b: InterestKey[]): number => {
  if (a.length === 0 || b.length === 0) return 0
  const setA = new Set(a)
  const setB = new Set(b)
  const intersection = [...setA].filter((x) => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size
  return Math.round((intersection / union) * 100)
}

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export const timeOverlapScore = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): number => {
  const start = Math.max(toMinutes(aStart), toMinutes(bStart))
  const end = Math.min(toMinutes(aEnd), toMinutes(bEnd))
  const overlap = Math.max(0, end - start)
  const spanA = toMinutes(aEnd) - toMinutes(aStart)
  const spanB = toMinutes(bEnd) - toMinutes(bStart)
  const shortestSpan = Math.min(spanA, spanB) || 1
  return Math.round((overlap / shortestSpan) * 100)
}

export const budgetCompatibilityScore = (budgetA: number, budgetB: number): number => {
  if (budgetA <= 0 || budgetB <= 0) return 0
  const diff = Math.abs(budgetA - budgetB)
  const avg = (budgetA + budgetB) / 2
  const ratio = diff / avg
  return Math.round(Math.max(0, 100 - ratio * 100))
}

export const destinationMatchScore = (destA: string, destB: string): number =>
  destA === destB ? 100 : 0

export interface CompatibilityInput {
  destinationId: string
  interests: InterestKey[]
  startTime: string
  endTime: string
  budget: number
}

export const computeCompatibility = (
  self: CompatibilityInput,
  other: Traveler,
): CompatibilityBreakdown => {
  const destinationMatch = destinationMatchScore(self.destinationId, other.destinationId)
  const interestMatch = interestSimilarity(self.interests, other.interests)
  const timeMatch = timeOverlapScore(self.startTime, self.endTime, other.startTime, other.endTime)
  const budgetMatch = budgetCompatibilityScore(self.budget, other.budget)

  const overall = Math.round(
    interestMatch * WEIGHTS.interest +
      timeMatch * WEIGHTS.time +
      destinationMatch * WEIGHTS.destination +
      budgetMatch * WEIGHTS.budget,
  )

  return { destinationMatch, interestMatch, timeMatch, budgetMatch, overall }
}

export const buildGroupReasons = (
  breakdown: CompatibilityBreakdown,
  travelerCount: number,
): string[] => {
  const reasons: string[] = []
  if (breakdown.destinationMatch >= 100) reasons.push('Same destination')
  if (breakdown.timeMatch >= 60) reasons.push('Overlapping schedule')
  if (breakdown.interestMatch >= 50) reasons.push('Similar interests')
  if (breakdown.budgetMatch >= 60) reasons.push('Compatible budget')
  if (travelerCount >= 2) reasons.push(`${travelerCount} travelers heading the same way`)
  return reasons
}

export const COMPATIBILITY_WEIGHTS = WEIGHTS
