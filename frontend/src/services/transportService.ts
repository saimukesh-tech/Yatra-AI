import type { TransportComparison } from '@/types/transport'
import { simulateLatency } from './api'

// Estimation-only. No real transport / booking API is connected in this
// prototype, so every figure here is clearly labelled "Estimated" in the UI
// and no vehicle is ever claimed to be booked.

const PER_PERSON_INDIVIDUAL_COST = 1000 // average local transport spend/person across the trip
const SHARED_SAVINGS_RATIO = 0.6 // shared travel costs ~60% of the individual total

const vehicleFor = (groupSize: number): { vehicle: string; capacity: number } => {
  if (groupSize <= 4) return { vehicle: 'Shared Cab', capacity: 4 }
  if (groupSize <= 8) return { vehicle: 'Mini-Bus', capacity: 8 }
  return { vehicle: 'Tempo Traveller', capacity: 12 }
}

export async function estimateTransport(groupSize: number): Promise<TransportComparison> {
  await simulateLatency(400)

  const individualTotal = groupSize * PER_PERSON_INDIVIDUAL_COST
  const sharedTotal = Math.round(individualTotal * SHARED_SAVINGS_RATIO)
  const { vehicle, capacity } = vehicleFor(groupSize)

  const savingsTotal = individualTotal - sharedTotal
  const savingsPerPerson = Math.round(savingsTotal / groupSize)

  return {
    groupSize,
    individual: { rideCount: groupSize, totalCost: individualTotal },
    shared: {
      vehicle,
      capacity,
      totalCost: sharedTotal,
      costPerPerson: Math.round(sharedTotal / groupSize),
    },
    savingsTotal,
    savingsPerPerson,
    isEstimate: true,
  }
}
