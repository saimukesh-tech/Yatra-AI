import type { TripInput } from '@/types/trip'
import type { TravelerGroup, CompatibilityBreakdown } from '@/types/traveler'
import { getTravelersFor } from '@/data/mockTravelers'
import { computeCompatibility, buildGroupReasons, type CompatibilityInput } from '@/utils/matching'
import { generateId } from '@/utils/id'
import { simulateLatency } from './api'

const MIN_OVERALL_SCORE = 55

const aggregateBreakdown = (items: CompatibilityBreakdown[]): CompatibilityBreakdown => {
  const avg = (key: keyof CompatibilityBreakdown) =>
    Math.round(items.reduce((sum, b) => sum + b[key], 0) / items.length)
  return {
    destinationMatch: avg('destinationMatch'),
    interestMatch: avg('interestMatch'),
    timeMatch: avg('timeMatch'),
    budgetMatch: avg('budgetMatch'),
    overall: avg('overall'),
  }
}

export async function findCompatibleGroups(input: TripInput): Promise<TravelerGroup[]> {
  await simulateLatency(500)

  const self: CompatibilityInput = {
    destinationId: input.destinationId,
    interests: input.interests,
    startTime: '09:00',
    endTime: '18:00',
    // Use the midpoint of the user's budget range rather than the ceiling,
    // so compatibility reflects typical spend instead of the max they'd
    // tolerate in the worst case.
    budget: Math.round((input.budgetMin + input.budgetMax) / 2),
  }

  const pool = getTravelersFor(input.destinationId)
  const candidates = pool
    .map((traveler) => ({ traveler, breakdown: computeCompatibility(self, traveler) }))
    .filter((c) => c.breakdown.overall >= MIN_OVERALL_SCORE)
    .sort((a, b) => b.breakdown.overall - a.breakdown.overall)

  if (candidates.length === 0) return []

  const groups: TravelerGroup[] = []

  const primary = candidates.slice(0, 4)
  const primaryBreakdown = aggregateBreakdown(primary.map((c) => c.breakdown))
  groups.push({
    id: generateId('grp'),
    label: 'Travel Group A',
    travelerCount: primary.length,
    travelers: primary.map((c) => c.traveler),
    compatibility: primaryBreakdown,
    reasons: buildGroupReasons(primaryBreakdown, primary.length),
  })

  const secondary = candidates.slice(4, 8)
  if (secondary.length >= 2) {
    const secondaryBreakdown = aggregateBreakdown(secondary.map((c) => c.breakdown))
    groups.push({
      id: generateId('grp'),
      label: 'Travel Group B',
      travelerCount: secondary.length,
      travelers: secondary.map((c) => c.traveler),
      compatibility: secondaryBreakdown,
      reasons: buildGroupReasons(secondaryBreakdown, secondary.length),
    })
  }

  return groups
}
