import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Route } from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useGroupMatching } from '@/hooks/useGroupMatching'
import { GroupCard } from '@/components/group/GroupCard'
import { SkeletonCard } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import type { TravelerGroup } from '@/types/traveler'

const FLOW = ['Your Itinerary', 'Compatible Travelers', 'Shared Itinerary', 'Transport', 'Savings']

export function GroupMatchPage() {
  const navigate = useNavigate()
  const { itinerary, tripInput } = useTripContext()
  const { groups, isLoading, isLoadingTransport, error, fetchGroups, chooseGroup } = useGroupMatching()

  useEffect(() => {
    if (!itinerary) {
      navigate('/plan', { replace: true })
      return
    }
    fetchGroups(tripInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary])

  if (!itinerary) return null

  const handleView = async (group: TravelerGroup) => {
    await chooseGroup(group)
    navigate('/transport')
  }

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app">
        <Badge variant="ai" className="mb-4">
          <Sparkles className="h-3.5 w-3.5" /> AI Group Travel Match
        </Badge>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Travel together. Spend less.</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          We found travelers whose plans for {itinerary.input.destinationName} closely match yours.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-ink/8 bg-white p-4 text-xs font-semibold text-ink-soft">
          {FLOW.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className={i === 1 ? 'text-brand-700' : ''}>{step}</span>
              {i < FLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {isLoading && (
            <>
              <SkeletonCard className="h-64" />
              <SkeletonCard className="h-64" />
            </>
          )}

          {!isLoading && error && <ErrorState onRetry={() => fetchGroups(tripInput)} />}

          {!isLoading && !error && groups.length === 0 && (
            <EmptyState
              icon={<Route className="h-6 w-6" />}
              title="No compatible travelers found."
              description="Try adjusting your travel time, budget, or interests to widen the match — or continue solo."
              action={
                <Button variant="outline" size="sm" onClick={() => navigate('/plan')}>
                  Adjust Trip Details
                </Button>
              }
            />
          )}

          {!isLoading &&
            !error &&
            groups.map((group) => (
              <GroupCard key={group.id} group={group} onView={handleView} isLoading={isLoadingTransport} />
            ))}
        </div>
      </div>
    </div>
  )
}
