import type { TripInput, InterestKey } from '@/types/trip'
import type {
  Attraction,
  Itinerary,
  ItineraryDay,
  ItineraryStop,
  ItineraryScores,
  ItineraryTotals,
} from '@/types/itinerary'
import { getAttractionsFor } from '@/data/mockAttractions'
import { getDestinationById, getDestinationByName, mockDestinations } from '@/data/mockDestinations'
import { generateId } from '@/utils/id'
import { simulateLatency } from './api'

const DAY_MINUTES_BUDGET = 7 * 60 // ~7 touring hours/day, matches constraints.ts

const formatMinutesLabel = (totalMinutes: number): string => {
  const hh = Math.floor((totalMinutes % (24 * 60)) / 60)
  const mm = totalMinutes % 60
  const period = hh >= 12 ? 'PM' : 'AM'
  const hour12 = hh % 12 === 0 ? 12 : hh % 12
  return `${hour12}:${mm.toString().padStart(2, '0')} ${period}`
}

const reasonFor = (attraction: Attraction, interests: InterestKey[]): string => {
  const overlap = attraction.categories.filter((c) => interests.includes(c))
  if (overlap.length > 0) {
    const label = overlap.map((c) => c[0].toUpperCase() + c.slice(1)).join(' and ')
    return `Strong match for your interest in ${label}.`
  }
  return `A well-rated way to experience the destination.`
}

const relevanceScore = (attraction: Attraction, interests: InterestKey[]): number => {
  if (interests.length === 0) return 50
  const overlap = attraction.categories.filter((c) => interests.includes(c)).length
  return (overlap / attraction.categories.length) * 100 + overlap * 15
}

const genericAttractionsFor = (destinationName: string, interests: InterestKey[]): Attraction[] => {
  // Fallback used when a freeform / unrecognised destination is typed in.
  const pool: InterestKey[] = interests.length > 0 ? interests : ['history', 'food', 'nature', 'photography']
  return pool.slice(0, 6).map((interest, i) => ({
    id: `generic-${destinationName}-${i}`,
    destinationId: 'generic',
    name: `${interest[0].toUpperCase() + interest.slice(1)} Highlights of ${destinationName}`,
    categories: [interest],
    description: `A curated local experience centered on ${interest} in ${destinationName}.`,
    durationMinutes: 90,
    cost: 250 + i * 50,
    sceneType: 'city',
    travelMinutesToNext: 20,
    distanceKmToNext: 6,
    bestSlot: i % 3 === 0 ? 'morning' : i % 3 === 1 ? 'afternoon' : 'evening',
  }))
}

interface BuildOverrides {
  budgetMax?: number
  maxHours?: number
}

const buildItinerary = (input: TripInput, overrides?: BuildOverrides): Itinerary => {
  const destination = getDestinationById(input.destinationId) ?? getDestinationByName(input.destinationName)
  const destinationName = destination?.name ?? input.destinationName ?? 'Your Destination'
  const rawAttractions = destination ? getAttractionsFor(destination.id) : []
  const pool = rawAttractions.length > 0 ? rawAttractions : genericAttractionsFor(destinationName, input.interests)

  const budgetMax = overrides?.budgetMax ?? input.budgetMax
  const totalMinutesBudget = overrides?.maxHours
    ? overrides.maxHours * 60
    : input.durationDays * DAY_MINUTES_BUDGET

  const scored = [...pool]
    .map((a) => ({ attraction: a, score: relevanceScore(a, input.interests) }))
    .sort((a, b) => b.score - a.score || a.attraction.cost - b.attraction.cost)

  const days: ItineraryDay[] = Array.from({ length: input.durationDays }, (_, i) => ({
    dayNumber: i + 1,
    label: `Day ${i + 1}`,
    summary: '',
    stops: [],
  }))

  let runningCost = 0
  let runningMinutes = 0
  let dayIndex = 0
  const perDayMinutesCap = totalMinutesBudget / input.durationDays
  const DAY_START_MINUTES = 9 * 60 // 9:00 AM
  const dayCursors = new Array(days.length).fill(DAY_START_MINUTES)

  for (const { attraction } of scored) {
    const cursorIdx = dayIndex % days.length
    const day = days[cursorIdx]
    const dayUsedMinutes = day.stops.reduce(
      (sum, s) => sum + s.attraction.durationMinutes + s.attraction.travelMinutesToNext,
      0,
    )
    const stopMinutes = attraction.durationMinutes + attraction.travelMinutesToNext

    const withinDayTime = dayUsedMinutes + stopMinutes <= perDayMinutesCap
    const withinOverallBudget = runningCost + attraction.cost <= budgetMax * 1.02
    const belowMinFloor = day.stops.length < 3 // keep every day feeling full even if slightly over budget

    if (withinDayTime && (withinOverallBudget || belowMinFloor)) {
      const startTime = formatMinutesLabel(dayCursors[cursorIdx])
      day.stops.push({
        attraction,
        time: startTime,
        reason: reasonFor(attraction, input.interests),
      })
      dayCursors[cursorIdx] += stopMinutes
      runningCost += attraction.cost
      runningMinutes += attraction.durationMinutes
      dayIndex++
    }
  }

  days.forEach((day) => {
    const cats = new Set(day.stops.flatMap((s) => s.attraction.categories))
    day.summary = cats.size > 0 ? Array.from(cats).slice(0, 3).map((c) => c[0].toUpperCase() + c.slice(1)).join(', ') : 'Free exploration'
  })

  const totalCost = days.flatMap((d) => d.stops).reduce((sum, s) => sum + s.attraction.cost, 0)
  const totalTouringMinutes = days.flatMap((d) => d.stops).reduce((sum, s) => sum + s.attraction.durationMinutes, 0)
  const totalDistance = days.flatMap((d) => d.stops).reduce((sum, s) => sum + s.attraction.distanceKmToNext, 0)
  const placeCount = days.flatMap((d) => d.stops).length

  const totals: ItineraryTotals = {
    cost: totalCost,
    timeHours: Math.round((totalTouringMinutes / 60) * 10) / 10,
    distanceKm: Math.round(totalDistance),
    placeCount,
  }

  const allStops = days.flatMap((d) => d.stops)
  const matchedStops = allStops.filter((s) => s.attraction.categories.some((c) => input.interests.includes(c)))
  const interestMatch =
    input.interests.length === 0
      ? 72
      : Math.min(98, Math.round((matchedStops.length / Math.max(1, allStops.length)) * 100 * 0.9 + 15))

  const avgDistance = allStops.length > 0 ? totalDistance / allStops.length : 0
  const routeEfficiency = Math.max(45, Math.min(98, Math.round(100 - avgDistance * 3.2)))

  const budgetFit = Math.max(0, Math.min(100, Math.round(100 - ((totalCost - budgetMax) / budgetMax) * 100)))
  const availableHours = totalMinutesBudget / 60
  const timeFit = Math.max(
    0,
    Math.min(100, Math.round(100 - ((totals.timeHours - availableHours) / availableHours) * 100)),
  )

  const scores: ItineraryScores = { interestMatch, budgetFit, timeFit, routeEfficiency }

  return {
    id: generateId('itin'),
    input: { ...input, destinationName },
    days,
    totals,
    scores,
    generatedAt: new Date().toISOString(),
  }
}

export async function generateItinerary(input: TripInput): Promise<Itinerary> {
  await simulateLatency(400)
  return buildItinerary(input)
}

export interface OptimizationResult {
  before: Itinerary
  after: Itinerary
  savings: {
    cost: number
    hours: number
    distanceKm: number
    places: number
  }
}

export async function optimizeItinerary(
  before: Itinerary,
  newBudgetMax: number,
  newAvailableHours: number,
): Promise<OptimizationResult> {
  await simulateLatency(900)
  const after = buildItinerary(before.input, { budgetMax: newBudgetMax, maxHours: newAvailableHours })
  return {
    before,
    after,
    savings: {
      cost: Math.max(0, before.totals.cost - after.totals.cost),
      hours: Math.max(0, before.totals.timeHours - after.totals.timeHours),
      distanceKm: Math.max(0, before.totals.distanceKm - after.totals.distanceKm),
      places: Math.max(0, before.totals.placeCount - after.totals.placeCount),
    },
  }
}

export const popularDestinationSuggestions = () => mockDestinations.filter((d) => d.popular)
