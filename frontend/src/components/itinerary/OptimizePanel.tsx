import { useState } from 'react'
import { Zap, MapPin, IndianRupee, Clock3, Route as RouteIcon, ArrowRight } from 'lucide-react'
import type { Itinerary } from '@/types/itinerary'
import type { OptimizationResult } from '@/services/itineraryService'
import { Button } from '@/components/common/Button'
import { formatCurrency } from '@/utils/budget'

interface OptimizePanelProps {
  itinerary: Itinerary
  optimization: OptimizationResult | null
  isOptimizing: boolean
  onOptimize: (budget: number, hours: number) => void
  onApply: () => void
  onDiscard: () => void
}

const metricRows = (itin: Itinerary) => [
  { icon: MapPin, label: 'Places', value: `${itin.totals.placeCount}` },
  { icon: IndianRupee, label: 'Cost', value: formatCurrency(itin.totals.cost) },
  { icon: Clock3, label: 'Time', value: `${itin.totals.timeHours}h` },
  { icon: RouteIcon, label: 'Distance', value: `${itin.totals.distanceKm} km` },
]

export function OptimizePanel({
  itinerary,
  optimization,
  isOptimizing,
  onOptimize,
  onApply,
  onDiscard,
}: OptimizePanelProps) {
  const defaultHours = itinerary.input.durationDays * 7
  const [budget, setBudget] = useState(itinerary.input.budgetMax)
  const [hours, setHours] = useState(defaultHours)

  return (
    <div>
      <p className="text-sm text-ink-muted">
        Tighten your budget or available time and let AI rebuild a leaner itinerary &mdash; without losing what matters most to you.
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink">
            <span>Budget</span>
            <span className="text-brand-700">{formatCurrency(budget)}</span>
          </div>
          <input
            type="range"
            min={Math.round(itinerary.totals.cost * 0.3)}
            max={itinerary.input.budgetMax}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-brand-600"
            aria-label="Budget"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-ink">
            <span>Available Time</span>
            <span className="text-brand-700">{hours}h</span>
          </div>
          <input
            type="range"
            min={Math.max(2, Math.round(defaultHours * 0.3))}
            max={defaultHours}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-brand-600"
            aria-label="Available time in hours"
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        fullWidth
        className="mt-6"
        loading={isOptimizing}
        iconLeft={!isOptimizing ? <Zap className="h-4 w-4" /> : undefined}
        onClick={() => onOptimize(budget, hours)}
      >
        Optimize Trip
      </Button>

      {optimization && (
        <div className="mt-6 animate-fade-up rounded-2xl border border-brand-100 bg-mint/50 p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">Before</p>
              <div className="space-y-1.5">
                {metricRows(optimization.before).map((m) => (
                  <p key={m.label} className="text-sm font-semibold text-ink-soft">
                    {m.value} <span className="text-xs text-ink-muted">{m.label}</span>
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-700">After</p>
              <div className="space-y-1.5">
                {metricRows(optimization.after).map((m) => (
                  <p key={m.label} className="text-sm font-bold text-ink">
                    {m.value} <span className="text-xs font-normal text-ink-muted">{m.label}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2.5 text-center text-sm font-bold text-white">
            You saved {formatCurrency(optimization.savings.cost)} and {optimization.savings.hours.toFixed(1)}h
          </p>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="sm" fullWidth onClick={onDiscard}>
              Keep Original
            </Button>
            <Button variant="primary" size="sm" fullWidth iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={onApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
