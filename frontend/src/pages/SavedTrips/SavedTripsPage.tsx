import { useNavigate } from 'react-router-dom'
import { Bookmark, Eye, Pencil, Share2, Trash2, MapPin } from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useToast } from '@/context/ToastContext'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/common/Button'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { formatCurrency, durationLabel } from '@/utils/budget'

export function SavedTripsPage() {
  const navigate = useNavigate()
  const { savedTrips, removeSavedTrip, setItinerary, setTripInput } = useTripContext()
  const { showToast } = useToast()

  const handleView = (id: string) => {
    const trip = savedTrips.find((t) => t.itinerary.id === id)
    if (!trip) return
    setItinerary(trip.itinerary)
    navigate('/itinerary')
  }

  const handleEdit = (id: string) => {
    const trip = savedTrips.find((t) => t.itinerary.id === id)
    if (!trip) return
    setTripInput(trip.itinerary.input)
    navigate('/plan')
  }

  const handleShare = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/itinerary?trip=${id}`)
      showToast('Trip link copied to clipboard (demo link).', 'success')
    } catch {
      showToast('Could not copy link in this browser.', 'warning')
    }
  }

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">My Trips</p>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Saved Trips</h1>
        <p className="mt-2 text-ink-muted">Every itinerary you&rsquo;ve saved, ready to revisit or share.</p>

        {savedTrips.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="No saved trips yet"
            description="Generate an itinerary and save it to see it here."
            action={
              <Button variant="primary" size="md" onClick={() => navigate('/plan')}>
                Plan a Trip
              </Button>
            }
            className="mt-10"
          />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedTrips.map((trip) => (
              <div key={trip.itinerary.id} className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft">
                <div className="relative h-32">
                  <SceneVisual variant="hills" seed={trip.itinerary.id.length} className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <p className="absolute inset-x-0 bottom-3 flex items-center gap-1 px-4 text-base font-bold text-white">
                    <MapPin className="h-4 w-4" />
                    {trip.itinerary.input.destinationName}
                  </p>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <span>{durationLabel(trip.itinerary.input.durationDays, trip.itinerary.input.durationNights)}</span>
                    <span>{formatCurrency(trip.itinerary.totals.cost)}</span>
                    <span className="font-semibold text-brand-700">{trip.itinerary.scores.interestMatch}% match</span>
                  </div>
                  {trip.groupMatched && (
                    <span className="mt-2 inline-block rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-brand-700">
                      Group matched
                    </span>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" iconLeft={<Eye className="h-3.5 w-3.5" />} onClick={() => handleView(trip.itinerary.id)}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" iconLeft={<Pencil className="h-3.5 w-3.5" />} onClick={() => handleEdit(trip.itinerary.id)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" iconLeft={<Share2 className="h-3.5 w-3.5" />} onClick={() => handleShare(trip.itinerary.id)}>
                      Share
                    </Button>
                    <button
                      aria-label={`Remove ${trip.itinerary.input.destinationName} trip`}
                      onClick={() => {
                        removeSavedTrip(trip.itinerary.id)
                        showToast('Trip removed.', 'info')
                      }}
                      className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-danger-50 hover:text-danger-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
