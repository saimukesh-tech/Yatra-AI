import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ArrowLeft } from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useGroupMatching } from '@/hooks/useGroupMatching'
import { useToast } from '@/context/ToastContext'
import { TransportComparison } from '@/components/transport/TransportComparison'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'

export function TransportPage() {
  const navigate = useNavigate()
  const { itinerary, saveCurrentTrip } = useTripContext()
  const { selectedGroup, transport, isLoadingTransport, clearSelection } = useGroupMatching()
  const { showToast } = useToast()

  useEffect(() => {
    if (!itinerary || !selectedGroup) {
      navigate('/group-match', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary, selectedGroup])

  if (!itinerary || !selectedGroup) return null

  const handleJoin = () => {
    saveCurrentTrip()
    showToast(
      `You've joined ${selectedGroup.label} — shared transport recommendation saved to your trip (demo).`,
      'success',
    )
    navigate('/trips')
  }

  const handleKeepOriginal = () => {
    clearSelection()
    navigate('/itinerary')
  }

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app max-w-3xl">
        <button
          onClick={() => navigate('/group-match')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to groups
        </button>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-brand-700">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{selectedGroup.label}</p>
            <p className="text-xs text-ink-muted">
              {selectedGroup.travelerCount} travelers &middot; {selectedGroup.compatibility.overall}% overall match
            </p>
          </div>
        </div>

        {isLoadingTransport || !transport ? (
          <div className="space-y-4 rounded-3xl border border-ink/8 bg-white p-7">
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-36" />
              <Skeleton className="h-36" />
            </div>
          </div>
        ) : (
          <TransportComparison comparison={transport} />
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" size="lg" fullWidth onClick={handleKeepOriginal}>
            Keep My Original Plan
          </Button>
          <Button variant="primary" size="lg" fullWidth disabled={!transport} onClick={handleJoin}>
            Join Group
          </Button>
        </div>
      </div>
    </div>
  )
}
