import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  Clock3,
  HeartHandshake,
  Route as RouteIcon,
  Download,
  Share2,
  Zap,
  BookmarkCheck,
  Bookmark,
  Users2,
  ArrowRight,
  MapIcon,
  ListChecks,
  Lightbulb,
  IndianRupee,
} from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useItinerary } from '@/hooks/useItinerary'
import { useToast } from '@/context/ToastContext'
import { buildConstraintChecks, hasFailingConstraint } from '@/utils/constraints'
import { formatCurrency } from '@/utils/budget'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { StatCard } from '@/components/common/StatCard'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Timeline } from '@/components/itinerary/Timeline'
import { ConstraintCheck } from '@/components/itinerary/ConstraintCheck'
import { OptimizePanel } from '@/components/itinerary/OptimizePanel'
import { MapCard } from '@/components/map/MapCard'
import { getDestinationById } from '@/data/mockDestinations'

type Tab = 'itinerary' | 'map' | 'cost' | 'tips'

const TABS: { key: Tab; label: string; icon: typeof ListChecks }[] = [
  { key: 'itinerary', label: 'Itinerary', icon: ListChecks },
  { key: 'map', label: 'Map View', icon: MapIcon },
  { key: 'cost', label: 'Day-wise Cost', icon: IndianRupee },
  { key: 'tips', label: 'Travel Tips', icon: Lightbulb },
]

const GENERIC_TIPS = [
  'Carry a printed or offline copy of your itinerary in case of patchy network.',
  'Keep small cash on hand — many local vendors and entry counters are cash-only.',
  'Start early in the day to beat crowds at popular photo spots.',
  'Check local weather the night before — hill and coastal routes can change plans quickly.',
  'Respect local customs at religious and heritage sites: modest dress, footwear rules.',
]

export function ItineraryPage() {
  const navigate = useNavigate()
  const { saveCurrentTrip, isCurrentTripSaved } = useTripContext()
  const { itinerary, optimization, isOptimizing, optimize, applyOptimization, clearOptimization } = useItinerary()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('itinerary')
  const [optimizeOpen, setOptimizeOpen] = useState(false)

  useEffect(() => {
    if (!itinerary) navigate('/plan', { replace: true })
  }, [itinerary, navigate])

  const checks = useMemo(() => (itinerary ? buildConstraintChecks(itinerary) : []), [itinerary])
  const destination = itinerary ? getDestinationById(itinerary.input.destinationId) : undefined

  if (!itinerary) return null

  const budgetCheck = checks.find((c) => c.key === 'budget')!
  const timeCheck = checks.find((c) => c.key === 'time')!
  const interestCheck = checks.find((c) => c.key === 'interest')!
  const routeCheck = checks.find((c) => c.key === 'route')!

  const whyReasons = [
    interestCheck.status === 'ok' && `Strongly matches your interests (${itinerary.scores.interestMatch}% match)`,
    budgetCheck.status !== 'exceeded' && 'Fits within your budget',
    `Optimized for your available time (${itinerary.input.durationDays} day${itinerary.input.durationDays !== 1 ? 's' : ''})`,
    'Includes local and offbeat experiences',
    routeCheck.status === 'ok' && 'Minimal travel time between locations',
  ].filter(Boolean) as string[]

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/itinerary?trip=${itinerary.id}`)
      showToast('Trip link copied to clipboard (demo link).', 'success')
    } catch {
      showToast('Could not copy link in this browser.', 'warning')
    }
  }

  const handleSave = () => {
    saveCurrentTrip()
    showToast('Trip saved to My Trips.', 'success')
  }

  return (
    <div className="pb-20">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          {destination && <SceneVisual variant={destination.sceneType} seed={3} className="h-full w-full" />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        </div>
        <div className="container-app relative py-12 sm:py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Your Personalized Itinerary</p>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Your {itinerary.input.destinationName} Trip
              </h1>
              <p className="mt-2 max-w-lg text-white/75">Designed around your interests, budget and available time.</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-medium text-white/85">
                <span>{itinerary.input.durationDays} Days ({itinerary.input.durationNights} Nights)</span>
                <span className="text-white/40">&middot;</span>
                <span>Target Budget: {formatCurrency(itinerary.input.budgetMax)}</span>
                <span className="text-white/40">&middot;</span>
                <span>{itinerary.input.interests.length} Interests Matched</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                iconLeft={<Download className="h-4 w-4" />}
                onClick={() => showToast('PDF export isn’t wired up in this demo.', 'info')}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                iconLeft={<Share2 className="h-4 w-4" />}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<Wallet className="h-5 w-5" />}
            label="Budget"
            value={`${formatCurrency(itinerary.totals.cost)}`}
            sublabel={`of ${formatCurrency(itinerary.input.budgetMax)}`}
            status={budgetCheck.status}
            tone="brand"
          />
          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Time"
            value={`${itinerary.totals.timeHours}h`}
            sublabel={`of ${timeCheck.targetLabel}`}
            status={timeCheck.status}
            tone="sky"
          />
          <StatCard
            icon={<HeartHandshake className="h-5 w-5" />}
            label="Interest Match"
            value={`${itinerary.scores.interestMatch}%`}
            sublabel="Highly personalized"
            status={interestCheck.status}
            tone="coral"
          />
          <StatCard
            icon={<RouteIcon className="h-5 w-5" />}
            label="Route Efficiency"
            value={`${itinerary.scores.routeEfficiency}%`}
            sublabel="Optimized"
            status={routeCheck.status}
            tone="amber"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-ink/8 pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key ? 'bg-brand-600 text-white' : 'text-ink-soft hover:bg-ink/5'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {tab === 'itinerary' && <Timeline days={itinerary.days} />}

            {tab === 'map' && <MapCard days={itinerary.days} />}

            {tab === 'cost' && (
              <div className="space-y-4">
                {itinerary.days.map((day) => {
                  const dayCost = day.stops.reduce((sum, s) => sum + s.attraction.cost, 0)
                  const maxCost = Math.max(...itinerary.days.map((d) => d.stops.reduce((s, st) => s + st.attraction.cost, 0)), 1)
                  return (
                    <div key={day.dayNumber} className="rounded-2xl border border-ink/8 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-ink">
                          {day.label} &middot; {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm font-extrabold text-brand-700">{formatCurrency(dayCost)}</p>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/6">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-700"
                          style={{ width: `${(dayCost / maxCost) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="rounded-2xl border border-brand-100 bg-mint/50 p-5">
                  <p className="flex items-center justify-between text-sm font-bold text-ink">
                    <span>Total estimated cost</span>
                    <span className="text-lg text-brand-700">{formatCurrency(itinerary.totals.cost)}</span>
                  </p>
                </div>
              </div>
            )}

            {tab === 'tips' && (
              <ul className="space-y-3">
                {GENERIC_TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 text-sm text-ink-soft">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6">
            <ConstraintCheck checks={checks} onFixWithAI={() => setOptimizeOpen(true)} />

            {tab !== 'map' && <MapCard days={itinerary.days} compact />}

            <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <p className="mb-3 text-sm font-bold text-ink">Why this itinerary?</p>
              <ul className="space-y-2">
                {whyReasons.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                iconLeft={<Zap className="h-4 w-4" />}
                onClick={() => setOptimizeOpen(true)}
              >
                Optimize Trip
              </Button>
              <Button
                variant={isCurrentTripSaved ? 'secondary' : 'outline'}
                size="lg"
                fullWidth
                iconLeft={isCurrentTripSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                onClick={handleSave}
                disabled={isCurrentTripSaved}
              >
                {isCurrentTripSaved ? 'Saved to My Trips' : 'Save Trip'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                iconLeft={<Users2 className="h-4 w-4" />}
                iconRight={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate('/group-match')}
              >
                Find Compatible Travelers
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        open={optimizeOpen}
        onClose={() => {
          setOptimizeOpen(false)
        }}
        title="Optimize Trip"
      >
        <OptimizePanel
          itinerary={itinerary}
          optimization={optimization}
          isOptimizing={isOptimizing}
          onOptimize={(budget, hours) => optimize(budget, hours)}
          onApply={() => {
            applyOptimization()
            setOptimizeOpen(false)
            showToast('Itinerary updated with your new constraints.', 'success')
          }}
          onDiscard={() => {
            clearOptimization()
            setOptimizeOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}
