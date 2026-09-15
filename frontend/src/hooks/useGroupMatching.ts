import { useCallback, useState } from 'react'
import { useTripContext } from '@/context/TripContext'
import { findCompatibleGroups } from '@/services/groupMatchService'
import { estimateTransport } from '@/services/transportService'
import type { TripInput } from '@/types/trip'
import type { TravelerGroup } from '@/types/traveler'

export function useGroupMatching() {
  const { groups, setGroups, selectedGroup, selectGroup, transport, setTransport } = useTripContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTransport, setIsLoadingTransport] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = useCallback(
    async (input: TripInput) => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await findCompatibleGroups(input)
        setGroups(result)
        return result
      } catch (e) {
        setError('Couldn’t find travel groups right now. Please try again.')
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [setGroups],
  )

  const chooseGroup = useCallback(
    async (group: TravelerGroup) => {
      selectGroup(group)
      setIsLoadingTransport(true)
      try {
        const comparison = await estimateTransport(group.travelerCount + 1) // +1 to include the current traveler
        setTransport(comparison)
      } finally {
        setIsLoadingTransport(false)
      }
    },
    [selectGroup, setTransport],
  )

  return {
    groups,
    selectedGroup,
    transport,
    isLoading,
    isLoadingTransport,
    error,
    fetchGroups,
    chooseGroup,
    clearSelection: () => {
      selectGroup(null)
      setTransport(null)
    },
  }
}
