import { Clock3, IndianRupee, Sparkles, ArrowDown } from 'lucide-react'
import type { ItineraryDay } from '@/types/itinerary'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { InterestIcon, interestLabel } from '@/components/trip/InterestChip'
import { formatCurrency } from '@/utils/budget'

interface TimelineProps {
  days: ItineraryDay[]
}

export function Timeline({ days }: TimelineProps) {
  return (
    <div className="space-y-10">
      {days.map((day, dayIdx) => (
        <div key={day.dayNumber} className="animate-fade-up" style={{ animationDelay: `${dayIdx * 80}ms` }}>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-sm font-extrabold text-white">
              {day.dayNumber}
            </span>
            <div>
              <p className="text-base font-bold text-ink">{day.label}</p>
              <p className="text-xs text-ink-muted">{day.summary}</p>
            </div>
          </div>

          {day.stops.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/15 p-5 text-sm text-ink-muted">
              No stops scheduled &mdash; try widening your budget or time in Optimize Trip.
            </p>
          ) : (
            <ol className="space-y-5 border-l-2 border-dashed border-brand-200 pl-6">
              {day.stops.map((stop, i) => (
                <li key={`${stop.attraction.id}-${i}`} className="relative animate-fade-up" style={{ animationDelay: `${dayIdx * 80 + i * 70}ms` }}>
                  <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-600 bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  </span>

                  <div className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft transition hover:shadow-card">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-32 w-full shrink-0 sm:h-auto sm:w-40">
                        <SceneVisual variant={stop.attraction.sceneType} seed={i + dayIdx * 5} className="h-full w-full" />
                      </div>
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{stop.time}</p>
                            <h3 className="mt-0.5 text-lg font-bold text-ink">{stop.attraction.name}</h3>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-bold text-brand-700">
                            <IndianRupee className="h-3 w-3" />
                            {stop.attraction.cost === 0 ? 'Free' : formatCurrency(stop.attraction.cost)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-ink-soft">
                          <span className="flex items-center gap-1">
                            {stop.attraction.categories.slice(0, 2).map((c) => (
                              <span key={c} className="flex items-center gap-1">
                                <InterestIcon interest={c} className="h-3.5 w-3.5" />
                                {interestLabel(c)}
                              </span>
                            ))}
                          </span>
                          <span className="flex items-center gap-1 text-ink-muted">
                            <Clock3 className="h-3.5 w-3.5" />
                            {Math.round(stop.attraction.durationMinutes / 6) / 10}h
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{stop.attraction.description}</p>

                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2 text-xs font-medium text-brand-800">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {stop.reason}
                        </div>
                      </div>
                    </div>
                  </div>

                  {i < day.stops.length - 1 && (
                    <div className="my-1 flex items-center gap-2 pl-1 text-[11px] font-semibold text-ink-muted">
                      <ArrowDown className="h-3 w-3" />~{stop.attraction.travelMinutesToNext} min to next stop
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  )
}
