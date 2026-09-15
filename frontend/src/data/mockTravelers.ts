import type { Traveler } from '@/types/traveler'

// A pool of "other travelers" already planning trips, used by the AI Group
// Travel Match feature. In a real backend this would come from live trip
// submissions; here it is a realistic static pool keyed by destination.

export const mockTravelers: Traveler[] = [
  // ---------------- Hyderabad ----------------
  { id: 'trv-hyd-1', label: 'Traveler A', destinationId: 'hyderabad', interests: ['history', 'food'], startTime: '09:00', endTime: '18:00', budget: 2500, durationDays: 2 },
  { id: 'trv-hyd-2', label: 'Traveler B', destinationId: 'hyderabad', interests: ['history', 'photography'], startTime: '10:00', endTime: '18:00', budget: 3000, durationDays: 2 },
  { id: 'trv-hyd-3', label: 'Traveler C', destinationId: 'hyderabad', interests: ['food', 'shopping'], startTime: '09:00', endTime: '17:00', budget: 2000, durationDays: 2 },
  { id: 'trv-hyd-4', label: 'Traveler D', destinationId: 'hyderabad', interests: ['photography', 'entertainment'], startTime: '11:00', endTime: '20:00', budget: 3500, durationDays: 3 },
  { id: 'trv-hyd-5', label: 'Traveler E', destinationId: 'hyderabad', interests: ['adventure', 'entertainment'], startTime: '08:00', endTime: '16:00', budget: 1500, durationDays: 1 },

  // ---------------- Araku Valley ----------------
  { id: 'trv-ark-1', label: 'Traveler A', destinationId: 'araku-valley', interests: ['nature', 'photography'], startTime: '07:00', endTime: '18:00', budget: 3200, durationDays: 3 },
  { id: 'trv-ark-2', label: 'Traveler B', destinationId: 'araku-valley', interests: ['nature', 'food'], startTime: '08:00', endTime: '17:00', budget: 2800, durationDays: 2 },
  { id: 'trv-ark-3', label: 'Traveler C', destinationId: 'araku-valley', interests: ['adventure', 'nature'], startTime: '07:30', endTime: '19:00', budget: 3000, durationDays: 3 },
  { id: 'trv-ark-4', label: 'Traveler D', destinationId: 'araku-valley', interests: ['shopping', 'food'], startTime: '10:00', endTime: '16:00', budget: 1800, durationDays: 2 },

  // ---------------- Hampi ----------------
  { id: 'trv-ham-1', label: 'Traveler A', destinationId: 'hampi', interests: ['history', 'photography'], startTime: '06:00', endTime: '18:00', budget: 2200, durationDays: 2 },
  { id: 'trv-ham-2', label: 'Traveler B', destinationId: 'hampi', interests: ['history', 'adventure'], startTime: '07:00', endTime: '17:00', budget: 1900, durationDays: 2 },
  { id: 'trv-ham-3', label: 'Traveler C', destinationId: 'hampi', interests: ['adventure', 'nature'], startTime: '06:30', endTime: '19:00', budget: 2500, durationDays: 3 },
  { id: 'trv-ham-4', label: 'Traveler D', destinationId: 'hampi', interests: ['food', 'photography'], startTime: '09:00', endTime: '17:00', budget: 1700, durationDays: 1 },

  // ---------------- Kerala ----------------
  { id: 'trv-ker-1', label: 'Traveler A', destinationId: 'kerala', interests: ['nature', 'food'], startTime: '08:00', endTime: '20:00', budget: 5500, durationDays: 4 },
  { id: 'trv-ker-2', label: 'Traveler B', destinationId: 'kerala', interests: ['nature', 'photography'], startTime: '09:00', endTime: '19:00', budget: 6000, durationDays: 4 },
  { id: 'trv-ker-3', label: 'Traveler C', destinationId: 'kerala', interests: ['food', 'entertainment'], startTime: '10:00', endTime: '20:00', budget: 4800, durationDays: 3 },
  { id: 'trv-ker-4', label: 'Traveler D', destinationId: 'kerala', interests: ['adventure', 'nature'], startTime: '07:00', endTime: '18:00', budget: 5200, durationDays: 3 },

  // ---------------- Ladakh ----------------
  { id: 'trv-lad-1', label: 'Traveler A', destinationId: 'ladakh', interests: ['adventure', 'nature'], startTime: '06:00', endTime: '19:00', budget: 8000, durationDays: 5 },
  { id: 'trv-lad-2', label: 'Traveler B', destinationId: 'ladakh', interests: ['adventure', 'photography'], startTime: '06:30', endTime: '18:30', budget: 7500, durationDays: 5 },
  { id: 'trv-lad-3', label: 'Traveler C', destinationId: 'ladakh', interests: ['spiritual', 'nature'], startTime: '07:00', endTime: '17:00', budget: 6800, durationDays: 4 },
  { id: 'trv-lad-4', label: 'Traveler D', destinationId: 'ladakh', interests: ['photography', 'shopping'], startTime: '09:00', endTime: '18:00', budget: 7000, durationDays: 4 },

  // ---------------- Madurai ----------------
  { id: 'trv-mdu-1', label: 'Traveler A', destinationId: 'madurai', interests: ['spiritual', 'history'], startTime: '06:00', endTime: '16:00', budget: 1600, durationDays: 2 },
  { id: 'trv-mdu-2', label: 'Traveler B', destinationId: 'madurai', interests: ['spiritual', 'food'], startTime: '07:00', endTime: '17:00', budget: 1400, durationDays: 1 },
  { id: 'trv-mdu-3', label: 'Traveler C', destinationId: 'madurai', interests: ['history', 'food'], startTime: '08:00', endTime: '18:00', budget: 1800, durationDays: 2 },
  { id: 'trv-mdu-4', label: 'Traveler D', destinationId: 'madurai', interests: ['shopping', 'food'], startTime: '09:00', endTime: '17:00', budget: 1500, durationDays: 1 },

  // ---------------- Goa ----------------
  { id: 'trv-goa-1', label: 'Traveler A', destinationId: 'goa', interests: ['nature', 'entertainment'], startTime: '10:00', endTime: '23:00', budget: 3500, durationDays: 3 },
  { id: 'trv-goa-2', label: 'Traveler B', destinationId: 'goa', interests: ['food', 'entertainment'], startTime: '11:00', endTime: '23:59', budget: 4000, durationDays: 3 },
  { id: 'trv-goa-3', label: 'Traveler C', destinationId: 'goa', interests: ['history', 'photography'], startTime: '08:00', endTime: '17:00', budget: 2800, durationDays: 2 },
  { id: 'trv-goa-4', label: 'Traveler D', destinationId: 'goa', interests: ['shopping', 'food'], startTime: '10:00', endTime: '20:00', budget: 3200, durationDays: 2 },

  // ---------------- Ooty ----------------
  { id: 'trv-oot-1', label: 'Traveler A', destinationId: 'ooty', interests: ['nature', 'photography'], startTime: '08:00', endTime: '18:00', budget: 2400, durationDays: 2 },
  { id: 'trv-oot-2', label: 'Traveler B', destinationId: 'ooty', interests: ['nature', 'adventure'], startTime: '07:00', endTime: '17:00', budget: 2200, durationDays: 2 },
  { id: 'trv-oot-3', label: 'Traveler C', destinationId: 'ooty', interests: ['shopping', 'food'], startTime: '09:00', endTime: '19:00', budget: 2000, durationDays: 1 },
  { id: 'trv-oot-4', label: 'Traveler D', destinationId: 'ooty', interests: ['photography', 'adventure'], startTime: '08:00', endTime: '18:00', budget: 2600, durationDays: 2 },

  // ---------------- Bengaluru ----------------
  { id: 'trv-blr-1', label: 'Traveler A', destinationId: 'bengaluru', interests: ['food', 'entertainment'], startTime: '10:00', endTime: '22:00', budget: 3200, durationDays: 2 },
  { id: 'trv-blr-2', label: 'Traveler B', destinationId: 'bengaluru', interests: ['shopping', 'food'], startTime: '11:00', endTime: '20:00', budget: 3000, durationDays: 2 },
  { id: 'trv-blr-3', label: 'Traveler C', destinationId: 'bengaluru', interests: ['nature', 'photography'], startTime: '08:00', endTime: '17:00', budget: 2400, durationDays: 1 },
  { id: 'trv-blr-4', label: 'Traveler D', destinationId: 'bengaluru', interests: ['entertainment', 'shopping'], startTime: '12:00', endTime: '23:00', budget: 3500, durationDays: 2 },

  // ---------------- Delhi ----------------
  { id: 'trv-del-1', label: 'Traveler A', destinationId: 'delhi', interests: ['history', 'photography'], startTime: '08:00', endTime: '18:00', budget: 2800, durationDays: 3 },
  { id: 'trv-del-2', label: 'Traveler B', destinationId: 'delhi', interests: ['food', 'shopping'], startTime: '09:00', endTime: '19:00', budget: 2600, durationDays: 2 },
  { id: 'trv-del-3', label: 'Traveler C', destinationId: 'delhi', interests: ['history', 'food'], startTime: '08:30', endTime: '18:30', budget: 3000, durationDays: 3 },
  { id: 'trv-del-4', label: 'Traveler D', destinationId: 'delhi', interests: ['shopping', 'entertainment'], startTime: '11:00', endTime: '20:00', budget: 3200, durationDays: 2 },

  // ---------------- Mumbai ----------------
  { id: 'trv-mum-1', label: 'Traveler A', destinationId: 'mumbai', interests: ['entertainment', 'food'], startTime: '10:00', endTime: '23:00', budget: 4000, durationDays: 2 },
  { id: 'trv-mum-2', label: 'Traveler B', destinationId: 'mumbai', interests: ['history', 'photography'], startTime: '08:00', endTime: '18:00', budget: 3200, durationDays: 2 },
  { id: 'trv-mum-3', label: 'Traveler C', destinationId: 'mumbai', interests: ['shopping', 'food'], startTime: '11:00', endTime: '21:00', budget: 3800, durationDays: 2 },
  { id: 'trv-mum-4', label: 'Traveler D', destinationId: 'mumbai', interests: ['photography', 'entertainment'], startTime: '09:00', endTime: '20:00', budget: 4200, durationDays: 3 },

  // ---------------- Chennai ----------------
  { id: 'trv-che-1', label: 'Traveler A', destinationId: 'chennai', interests: ['spiritual', 'food'], startTime: '07:00', endTime: '17:00', budget: 1900, durationDays: 2 },
  { id: 'trv-che-2', label: 'Traveler B', destinationId: 'chennai', interests: ['nature', 'food'], startTime: '08:00', endTime: '18:00', budget: 2100, durationDays: 2 },
  { id: 'trv-che-3', label: 'Traveler C', destinationId: 'chennai', interests: ['history', 'spiritual'], startTime: '07:30', endTime: '17:30', budget: 1800, durationDays: 1 },
  { id: 'trv-che-4', label: 'Traveler D', destinationId: 'chennai', interests: ['food', 'shopping'], startTime: '10:00', endTime: '19:00', budget: 2000, durationDays: 2 },
]

export const getTravelersFor = (destinationId: string): Traveler[] =>
  mockTravelers.filter((t) => t.destinationId === destinationId)
