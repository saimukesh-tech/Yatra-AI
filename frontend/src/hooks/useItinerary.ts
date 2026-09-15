import { useCallback, useState } from 'react'
import { useTripContext } from '@/context/TripContext'
import { generateItinerary, optimizeItinerary } from '@/services/itineraryService'
import type { TripInput } from '@/types/trip'

export const PLANNING_STAGES = [
  'Understanding your interests',
  'Checking your budget',
  'Selecting relevant places',
  'Optimizing travel time',
  'Checking route efficiency',
  'Building your itinerary',
  'Finding compatible travelers',
] as const

export function useItinerary() {
  const { itinerary, setItinerary, optimization, setOptimization, applyOptimization } = useTripContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const generate = useCallback(
    async (input: TripInput) => {
      setIsGenerating(true)
      setError(null)
      try {
        const result = await generateItinerary(input)
        setItinerary(result)
        return result
      } catch (e) {
        setError('AI couldn’t generate a plan. Please try again.')
        throw e
      } finally {
        setIsGenerating(false)
      }
    },
    [setItinerary],
  )

  const optimize = useCallback(
    async (newBudgetMax: number, newAvailableHours: number) => {
      if (!itinerary) return
      setIsOptimizing(true)
      setError(null)
      try {
        const result = await optimizeItinerary(itinerary, newBudgetMax, newAvailableHours)
        setOptimization(result)
        return result
      } catch (e) {
        setError('Optimization failed. Please try again.')
        throw e
      } finally {
        setIsOptimizing(false)
      }
    },
    [itinerary, setOptimization],
  )

  return {
    itinerary,
    isGenerating,
    isOptimizing,
    error,
    optimization,
    generate,
    optimize,
    applyOptimization,
    clearOptimization: () => setOptimization(null),
  }
}
