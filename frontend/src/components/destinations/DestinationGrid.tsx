import type { Destination } from '@/types/trip'
import { DestinationCard } from './DestinationCard'
import { EmptyState } from '@/components/common/EmptyState'

interface DestinationGridProps {
  destinations: Destination[]
  variant?: 'compact' | 'detailed'
  scroll?: boolean
}

export function DestinationGrid({ destinations, variant = 'compact', scroll = false }: DestinationGridProps) {
  if (destinations.length === 0) {
    return (
      <EmptyState
        title="No destinations match your filters"
        description="Try clearing a filter or searching for something else."
      />
    )
  }

  if (scroll) {
    return (
      <div className="scrollbar-none -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:px-0">
        {destinations.map((d, i) => (
          <div key={d.id} className="w-[78vw] max-w-[300px] shrink-0 sm:w-auto sm:max-w-none">
            <DestinationCard destination={d} variant={variant} seed={i} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {destinations.map((d, i) => (
        <DestinationCard key={d.id} destination={d} variant={variant} seed={i} />
      ))}
    </div>
  )
}
