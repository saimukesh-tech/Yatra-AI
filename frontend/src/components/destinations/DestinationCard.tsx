import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import type { Destination } from '@/types/trip'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { formatCurrency } from '@/utils/budget'

interface DestinationCardProps {
  destination: Destination
  variant?: 'compact' | 'detailed'
  seed?: number
}

export function DestinationCard({ destination, variant = 'compact', seed = 0 }: DestinationCardProps) {
  return (
    <Link
      to={`/plan?destination=${destination.id}`}
      className="group block shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pop"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SceneVisual
          variant={destination.sceneType}
          seed={seed}
          label={destination.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
        <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="flex items-center gap-1 text-base font-bold text-white">
            <MapPin className="h-4 w-4 text-brand-300" />
            {destination.name}
          </p>
          <p className="mt-0.5 text-xs font-medium text-white/80">{destination.categories.join(' • ')}</p>
        </div>
      </div>
      {variant === 'detailed' && (
        <div className="p-4">
          <p className="line-clamp-2 text-sm text-ink-muted">{destination.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-soft">
            <span>{destination.state}</span>
            <span>~{formatCurrency(destination.avgDailyBudget)}/day</span>
          </div>
        </div>
      )}
    </Link>
  )
}
