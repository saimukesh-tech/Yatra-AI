import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import { useTripPlanner } from '@/hooks/useTripPlanner'
import { mockDestinations, getDestinationById } from '@/data/mockDestinations'
import { INTEREST_OPTIONS, InterestChip } from '@/components/trip/InterestChip'
import { Input } from '@/components/common/Input'
import { Textarea } from '@/components/common/Textarea'
import { TripSummary } from '@/components/trip/TripSummary'
import { Button } from '@/components/common/Button'
import { formatCurrency, budgetTierLabel } from '@/utils/budget'

const BUDGET_PRESETS = [
  { label: 'Budget', min: 800, max: 2000 },
  { label: 'Moderate', min: 2000, max: 6000 },
  { label: 'Comfort', min: 6000, max: 15000 },
  { label: 'Premium', min: 15000, max: 40000 },
]

const DURATION_PRESETS = [
  { label: 'Weekend (2-3 days)', days: 3, nights: 2 },
  { label: '3-5 days', days: 4, nights: 3 },
  { label: '1 week', days: 7, nights: 6 },
  { label: '2 weeks', days: 14, nights: 13 },
]

export function PlanTripPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    tripInput,
    setDestination,
    setBudget,
    setDuration,
    toggleInterest,
    setConstraints,
    isReadyToGenerate,
  } = useTripPlanner()

  const [query, setQuery] = useState(tripInput.destinationName)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [customDuration, setCustomDuration] = useState(false)

  useEffect(() => {
    const destId = searchParams.get('destination')
    if (destId) {
      const dest = getDestinationById(destId)
      if (dest) {
        setDestination(dest.id, dest.name)
        setQuery(dest.name)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const suggestions = useMemo(() => {
    if (!query.trim()) return mockDestinations.filter((d) => d.popular).slice(0, 6)
    return mockDestinations.filter((d) => d.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
  }, [query])

  const handleSelectDestination = (id: string, name: string) => {
    setDestination(id, name)
    setQuery(name)
    setShowSuggestions(false)
  }

  const handleFreeformDestination = () => {
    if (query.trim() && !suggestions.some((s) => s.name.toLowerCase() === query.trim().toLowerCase())) {
      setDestination('', query.trim())
    }
  }

  const handleGenerate = () => {
    if (!isReadyToGenerate) return
    navigate('/planning')
  }

  return (
    <div className="bg-cream pb-28 pt-10 sm:pb-16 sm:pt-14">
      <div className="container-app">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Let&rsquo;s Plan Your Journey</p>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Let&rsquo;s design your trip.</h1>
          <p className="mt-2 text-ink-muted">
            Tell us a little about what you want. YatraAI will handle the planning.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-8">
            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-lg font-bold text-ink">Where are you going?</h2>
              <div className="relative mt-4">
                <Input
                  iconLeft={<Search className="h-4 w-4" />}
                  placeholder="Search for a city, state or attraction..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    window.setTimeout(() => setShowSuggestions(false), 150)
                    handleFreeformDestination()
                  }}
                  aria-label="Search destination"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-pop">
                    {suggestions.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onMouseDown={() => handleSelectDestination(d.id, d.name)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-mint"
                        >
                          <MapPin className="h-4 w-4 text-brand-600" />
                          {d.name}
                          <span className="ml-auto text-xs text-ink-muted">{d.state}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Popular Destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {mockDestinations
                  .filter((d) => d.popular)
                  .map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDestination(d.id, d.name)}
                      className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        tripInput.destinationId === d.id
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
              </div>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-lg font-bold text-ink">What&rsquo;s your budget?</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGET_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBudget(preset.min, preset.max)}
                    className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      tripInput.budgetMin === preset.min && tripInput.budgetMax === preset.max
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Min (₹)"
                  min={0}
                  value={tripInput.budgetMin}
                  onChange={(e) => setBudget(Number(e.target.value), tripInput.budgetMax)}
                />
                <Input
                  type="number"
                  label="Max (₹)"
                  min={0}
                  value={tripInput.budgetMax}
                  onChange={(e) => setBudget(tripInput.budgetMin, Number(e.target.value))}
                />
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                {formatCurrency(tripInput.budgetMin)} &ndash; {formatCurrency(tripInput.budgetMax)} &middot;{' '}
                {budgetTierLabel(tripInput.budgetMax)}
              </p>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-lg font-bold text-ink">How much time do you have?</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setDuration(preset.days, preset.nights)
                      setCustomDuration(false)
                    }}
                    className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      !customDuration && tripInput.durationDays === preset.days
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomDuration(true)}
                  className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    customDuration
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400'
                  }`}
                >
                  Custom
                </button>
              </div>
              {customDuration && (
                <div className="mt-4 max-w-[180px]">
                  <Input
                    type="number"
                    label="Number of days"
                    min={1}
                    max={30}
                    value={tripInput.durationDays}
                    onChange={(e) => {
                      const days = Math.max(1, Number(e.target.value))
                      setDuration(days, Math.max(0, days - 1))
                    }}
                  />
                </div>
              )}
              <p className="mt-3 text-sm text-ink-muted">
                Trip Duration: {tripInput.durationDays} Day{tripInput.durationDays !== 1 ? 's' : ''} (
                {tripInput.durationNights} Night{tripInput.durationNights !== 1 ? 's' : ''})
              </p>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-lg font-bold text-ink">What do you love?</h2>
              <p className="mt-1 text-sm text-ink-muted">Pick as many as you like.</p>
              <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label="Interests">
                {INTEREST_OPTIONS.map((opt) => (
                  <InterestChip
                    key={opt.key}
                    interest={opt.key}
                    selected={tripInput.interests.includes(opt.key)}
                    onToggle={toggleInterest}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="text-lg font-bold text-ink">Anything we should consider?</h2>
              <Textarea
                className="mt-4"
                placeholder="e.g. Prefer less travel, vegetarian food, avoid crowded places..."
                value={tripInput.constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </section>

            <div className="hidden sm:block">
              <Button variant="primary" size="lg" disabled={!isReadyToGenerate} onClick={handleGenerate}>
                ✨ Generate My Trip
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <TripSummary input={tripInput} onGenerate={handleGenerate} isReady={isReadyToGenerate} />
            </div>
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <TripSummary input={tripInput} onGenerate={handleGenerate} isReady={isReadyToGenerate} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/8 bg-white/95 p-4 backdrop-blur sm:hidden">
        <Button variant="primary" size="lg" fullWidth disabled={!isReadyToGenerate} onClick={handleGenerate}>
          ✨ Generate My Trip
        </Button>
      </div>
    </div>
  )
}
