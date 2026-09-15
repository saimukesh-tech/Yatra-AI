import { Link } from 'react-router-dom'
import { Plane, Compass as CompassIcon, Users, MapPin, Star } from 'lucide-react'
import { SceneVisual } from '@/components/ui/SceneVisual'
import { Button } from '@/components/common/Button'

const STATS = [
  { icon: Users, value: '10K+', label: 'Travelers', note: 'demo figure' },
  { icon: MapPin, value: '500+', label: 'Destinations', note: 'demo figure' },
  { icon: Star, value: '4.8/5', label: 'User Rating', note: 'demo figure' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <SceneVisual variant="hills" seed={4} className="h-full w-full scale-105 animate-[scaleIn_1.4s_ease-out]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
      </div>

      <div className="pointer-events-none absolute right-6 top-24 hidden max-w-[220px] -rotate-2 font-hand text-3xl leading-snug text-white/90 sm:right-10 sm:block lg:right-16 lg:top-28 lg:text-4xl">
        Good Places
        <br />
        Brighter People
      </div>

      <div className="container-app relative flex min-h-[640px] flex-col justify-end pb-14 pt-32 sm:min-h-[720px] sm:pb-20 lg:min-h-[780px]">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-300">
            Your Trip. Your Interests. Our AI
          </p>
          <h1 className="text-hero-mobile font-display font-extrabold text-white sm:text-hero lg:text-hero-lg">
            Plan Smarter.
            <br />
            <span className="text-brand-400">Travel Better.</span>
          </h1>
          <p className="mt-5 max-w-lg text-balance text-base text-white/85 sm:text-lg">
            Get personalized itineraries that match your interests, budget, time and real-world
            conditions &mdash; powered by AI.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/plan">
              <Button variant="primary" size="lg" iconLeft={<Plane className="h-4 w-4" />} fullWidth className="sm:w-auto">
                Plan My Trip
              </Button>
            </Link>
            <Link to="/explore">
              <Button
                variant="outline"
                size="lg"
                iconLeft={<CompassIcon className="h-4 w-4" />}
                fullWidth
                className="border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20 sm:w-auto"
              >
                Explore Destinations
              </Button>
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-up"
                style={{ animationDelay: `${200 + i * 120}ms`, animationFillMode: 'both' }}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-extrabold text-white">{stat.value}</dd>
                <dd className="text-xs font-medium text-white/70">
                  {stat.label} <span className="text-white/40">&middot; {stat.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-[42%] hidden w-64 -translate-y-1/2 animate-float rounded-2xl bg-white/95 p-5 shadow-pop backdrop-blur sm:block lg:right-16 lg:w-72">
        <p className="text-lg leading-snug text-ink-soft">
          &ldquo;Not just a trip,
          <br />
          but a story worth telling.&rdquo;
        </p>
        <span className="mt-3 block h-px w-8 bg-brand-400" />
      </div>
    </section>
  )
}
