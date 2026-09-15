import { Link } from 'react-router-dom'
import { ArrowRight, Users2, Bus, PiggyBank, Sparkles, MapPin, Clock3, Wallet } from 'lucide-react'
import { Hero } from '@/components/hero/Hero'
import { FeatureStrip } from '@/components/hero/FeatureStrip'
import { SectionHeading } from '@/components/common/SectionHeading'
import { DestinationGrid } from '@/components/destinations/DestinationGrid'
import { HowItWorksSteps } from '@/components/common/HowItWorksSteps'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { mockDestinations } from '@/data/mockDestinations'

const HOW_IT_WORKS_STEPS = [
  { number: '01', title: "Tell us where you're going.", description: 'Pick a destination or search for one.' },
  { number: '02', title: 'Tell us what you love.', description: 'Budget, time and interests — nothing more.' },
  { number: '03', title: 'AI builds and optimizes your itinerary.', description: 'Matched to your constraints, stop by stop.' },
  { number: '04', title: 'Find compatible travelers and save.', description: 'Match with others and split shared transport.' },
]

export function HomePage() {
  const popularDestinations = mockDestinations.filter((d) => d.popular).slice(0, 5)

  return (
    <>
      <Hero />
      <FeatureStrip />

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <SectionHeading
            eyebrow="Explore India"
            title="Popular Destinations"
            linkTo="/explore"
            linkLabel="View All"
          />
          <div className="mt-8">
            <DestinationGrid destinations={popularDestinations} scroll />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-app">
          <SectionHeading
            eyebrow="Simple by design"
            title="Your trip, intelligently planned."
            subtitle="Four steps between you and a fully personalized, budget-checked itinerary."
            align="center"
          />
          <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} className="mt-14" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <SceneVisual variant="mountain" seed={2} className="h-full w-full" />
        </div>
        <div className="container-app relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="ai" className="mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Our biggest differentiator
              </Badge>
              <h2 className="text-balance text-3xl font-extrabold text-white sm:text-4xl lg:text-[2.75rem]">
                Travel together. Spend less.
              </h2>
              <p className="mt-4 max-w-lg text-balance text-white/75">
                YatraAI matches you with travelers heading to the same place, around the same time,
                with similar interests and budgets &mdash; then recommends shared transport with an
                estimated cost saving.
              </p>
              <Link to="/plan" className="mt-7 inline-block">
                <Button variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Plan a Trip to Get Matched
                </Button>
              </Link>
            </div>

            <div className="rounded-3xl bg-white/95 p-6 shadow-pop backdrop-blur sm:p-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">Travel Group A</p>
                <Badge variant="success">92% Match</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                {[
                  { label: 'Destination', value: '100%' },
                  { label: 'Interests', value: '92%' },
                  { label: 'Timing', value: '88%' },
                  { label: 'Budget', value: '90%' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-mint p-3">
                    <p className="text-lg font-extrabold text-brand-700">{s.value}</p>
                    <p className="text-xs font-semibold text-ink-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-brand-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Bus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">Shared Mini-Bus</p>
                    <p className="text-xs text-ink-muted">Estimated, 4 travelers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-extrabold text-brand-700">
                    <PiggyBank className="h-4 w-4" /> Save ₹1,600
                  </p>
                  <p className="text-xs text-ink-muted">vs. individual rides</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-app">
          <SectionHeading
            eyebrow="See it in action"
            title="Every trip comes with a health check."
            subtitle="Budget, time, interest match and route efficiency — explained, not just generated."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">Day 1 &middot; Araku Valley</p>
                <Badge variant="info">AI Optimized</Badge>
              </div>
              <ul className="mt-5 space-y-4">
                {[
                  { time: '9:00 AM', name: 'Borra Caves', tag: 'Nature • Adventure', cost: '₹90' },
                  { time: '11:15 AM', name: 'Coffee Plantation Visit', tag: 'Nature • Food', cost: '₹150' },
                  { time: '1:30 PM', name: 'Araku Valley Viewpoint', tag: 'Photography', cost: '₹0' },
                ].map((stop) => (
                  <li key={stop.name} className="flex items-center gap-4 border-t border-ink/6 pt-4 first:border-t-0 first:pt-0">
                    <span className="w-20 shrink-0 text-xs font-bold text-brand-700">{stop.time}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">{stop.name}</p>
                      <p className="text-xs text-ink-muted">{stop.tag}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink-soft">{stop.cost}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { icon: Wallet, label: 'Budget', value: '₹1,850 / ₹3,000', tone: 'brand' as const },
                { icon: Clock3, label: 'Time', value: '7h / 8h', tone: 'sky' as const },
                { icon: MapPin, label: 'Interest Match', value: '94%', tone: 'amber' as const },
                { icon: Users2, label: 'Route Efficiency', value: '89%', tone: 'coral' as const },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-soft">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      s.tone === 'brand'
                        ? 'bg-brand-50 text-brand-700'
                        : s.tone === 'sky'
                          ? 'bg-sky-50 text-sky-600'
                          : s.tone === 'amber'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-coral-50 text-coral-600'
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{s.label}</p>
                    <p className="text-base font-extrabold text-ink">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-4xl bg-brand-700 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <SceneVisual variant="beach" seed={7} className="h-full w-full" />
            </div>
            <div className="relative">
              <h2 className="text-balance text-3xl font-extrabold text-white sm:text-4xl">
                Your next trip is a few taps away.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-balance text-white/80">
                Tell YatraAI where you want to go &mdash; we&rsquo;ll handle the planning, the budget
                check and finding your travel crew.
              </p>
              <Link to="/plan" className="mt-7 inline-block">
                <Button
                  variant="secondary"
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="bg-white text-brand-700 hover:bg-cream"
                >
                  Plan My Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
