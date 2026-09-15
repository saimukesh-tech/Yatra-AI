import { useCallback, useMemo } from 'react'
import type { InterestKey } from '@/types/trip'
import { useTripContext } from '@/context/TripContext'
import { getDestinationById } from '@/data/mockDestinations'

/**
 * Thin, form-friendly wrapper around the shared trip input living in
 * TripContext. Keeps validation/derived-state logic out of the PlanTrip
 * page component itself.
 */
export function useTripPlanner() {
  const { tripInput, setTripInput } = useTripContext()

  const setDestination = useCallback(
    (destinationId: string, destinationName: string) => {
      setTripInput((prev) => ({ ...prev, destinationId, destinationName }))
    },
    [setTripInput],
  )

  const setBudget = useCallback(
    (budgetMin: number, budgetMax: number) => {
      setTripInput((prev) => ({ ...prev, budgetMin, budgetMax }))
    },
    [setTripInput],
  )

  const setDuration = useCallback(
    (durationDays: number, durationNights: number) => {
      setTripInput((prev) => ({ ...prev, durationDays, durationNights }))
    },
    [setTripInput],
  )

  const toggleInterest = useCallback(
    (interest: InterestKey) => {
      setTripInput((prev) => {
        const has = prev.interests.includes(interest)
        return {
          ...prev,
          interests: has ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
        }
      })
    },
    [setTripInput],
  )

  const setConstraints = useCallback(
    (constraints: string) => {
      setTripInput((prev) => ({ ...prev, constraints }))
    },
    [setTripInput],
  )

  const setTravelers = useCallback(
    (travelers: number) => {
      setTripInput((prev) => ({ ...prev, travelers: Math.max(1, travelers) }))
    },
    [setTripInput],
  )

  const destination = useMemo(() => getDestinationById(tripInput.destinationId), [tripInput.destinationId])

  const isReadyToGenerate = useMemo(
    () => tripInput.destinationName.trim().length > 0 && tripInput.interests.length > 0,
    [tripInput],
  )

  return {
    tripInput,
    destination,
    setDestination,
    setBudget,
    setDuration,
    toggleInterest,
    setConstraints,
    setTravelers,
    isReadyToGenerate,
  }
}
