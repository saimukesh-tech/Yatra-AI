import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Wallet2, Bookmark, Settings, LogOut } from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { interestLabel } from '@/components/trip/InterestChip'
import { formatCurrency } from '@/utils/budget'

export function ProfilePage() {
  const navigate = useNavigate()
  const { savedTrips } = useTripContext()
  const { showToast } = useToast()

  const stats = useMemo(() => {
    const destinations = new Set(savedTrips.map((t) => t.itinerary.input.destinationName))
    const totalSpend = savedTrips.reduce((sum, t) => sum + t.itinerary.totals.cost, 0)
    const interestCounts = new Map<string, number>()
    savedTrips.forEach((t) =>
      t.itinerary.input.interests.forEach((i) => interestCounts.set(i, (interestCounts.get(i) ?? 0) + 1)),
    )
    const topInterests = [...interestCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => k)
    return { destinationCount: destinations.size, totalSpend, topInterests }
  }, [savedTrips])

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app max-w-3xl">
        <div className="rounded-3xl border border-ink/8 bg-white p-7 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-extrabold text-white">
                A
              </span>
              <div>
                <p className="text-xl font-extrabold text-ink">Demo Traveler</p>
                <p className="text-sm text-ink-muted">demo@yatraai.app</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Settings className="h-4 w-4" />}
                onClick={() => showToast('Account settings aren’t wired up in this demo.', 'info')}
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconLeft={<LogOut className="h-4 w-4" />}
                onClick={() => showToast('This is a demo profile — no real account is signed in.', 'info')}
              >
                Log out
              </Button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-ink/6 pt-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-ink">{savedTrips.length}</p>
              <p className="text-xs font-semibold text-ink-muted">Saved Trips</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{stats.destinationCount}</p>
              <p className="text-xs font-semibold text-ink-muted">Destinations</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink">{formatCurrency(stats.totalSpend)}</p>
              <p className="text-xs font-semibold text-ink-muted">Total Planned Spend</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-ink/8 bg-white p-7 shadow-soft">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Wallet2 className="h-4 w-4 text-brand-600" /> Travel Preferences
          </p>
          {stats.topInterests.length === 0 ? (
            <p className="text-sm text-ink-muted">Save a trip to build your preference profile.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.topInterests.map((i) => (
                <Badge key={i} variant="success">
                  {interestLabel(i as never)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-ink/8 bg-white p-7 shadow-soft">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Bookmark className="h-4 w-4 text-brand-600" /> Recent Destinations
          </p>
          {savedTrips.length === 0 ? (
            <p className="text-sm text-ink-muted">No trips saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {savedTrips.slice(0, 5).map((t) => (
                <li key={t.itinerary.id} className="flex items-center gap-2 text-sm text-ink-soft">
                  <MapPin className="h-3.5 w-3.5 text-brand-600" />
                  {t.itinerary.input.destinationName}
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => navigate('/trips')}>
            View All Trips
          </Button>
        </div>
      </div>
    </div>
  )
}
