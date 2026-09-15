export interface IndividualTravelEstimate {
  rideCount: number
  totalCost: number
}

export interface SharedTravelEstimate {
  vehicle: string
  capacity: number
  totalCost: number
  costPerPerson: number
}

export interface TransportComparison {
  groupSize: number
  individual: IndividualTravelEstimate
  shared: SharedTravelEstimate
  savingsTotal: number
  savingsPerPerson: number
  isEstimate: true
}
