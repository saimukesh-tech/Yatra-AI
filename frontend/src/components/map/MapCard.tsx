import { MapPin, Navigation } from 'lucide-react'
import type { ItineraryDay } from '@/types/itinerary'

interface MapCardProps {
  days: ItineraryDay[]
  compact?: boolean
  className?: string
}

// No real map API is connected in this prototype, so route + markers are a
// polished visual mock: a stylised vertical route line with a stop marker
// per attraction, in itinerary order. It communicates the flow of the trip
// without overstating what's actually rendered.
export function MapCard({ days, compact = false, className = '' }: MapCardProps) {
  const stops = days.flatMap((day) => day.stops.map((s) => ({ ...s, dayNumber: day.dayNumber })))

  if (stops.length === 0) {
    return (
      <div className={`rounded-3xl border border-ink/8 bg-mint/40 p-8 text-center text-sm text-ink-muted ${className}`}>
        Add stops to your itinerary to see the route.
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border border-ink/8 bg-gradient-to-b from-mint/60 to-white p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-ink">Trip Route</p>
        <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
          <Navigation className="h-3.5 w-3.5" /> Estimated route
        </span>
      </div>
      <ol className={`space-y-0 ${compact ? 'max-h-72 overflow-y-auto pr-1' : ''}`}>
        {stops.map((stop, i) => (
          <li key={`${stop.attraction.id}-${i}`} className="relative flex gap-3 pb-6 last:pb-0">
            {i < stops.length - 1 && (
              <span className="absolute left-[9px] top-6 h-full w-0.5 bg-brand-300" aria-hidden="true" />
            )}
            <span
              className={`z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                i === 0
                  ? 'border-danger-500 bg-danger-500'
                  : i === stops.length - 1
                    ? 'border-brand-700 bg-brand-700'
                    : 'border-brand-500 bg-white'
              }`}
            >
              {i !== 0 && i !== stops.length - 1 && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
            </span>
            <div className="flex-1">
              <p className="flex items-center gap-1 text-sm font-bold text-ink">
                <MapPin className="h-3.5 w-3.5 text-ink-muted" />
                {stop.attraction.name}
              </p>
              <p className="text-xs text-ink-muted">
                Day {stop.dayNumber} &middot; {stop.time}
                {i < stops.length - 1 && ` • ~${stop.attraction.travelMinutesToNext} min to next stop`}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
