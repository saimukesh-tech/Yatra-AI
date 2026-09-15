import { Target, IndianRupee, Clock, CloudSun, HeartHandshake } from 'lucide-react'
import { IconCircle } from '@/components/common/IconCircle'

const FEATURES = [
  { icon: Target, tone: 'brand' as const, title: 'Personalized Itineraries', desc: 'Based on your interests' },
  { icon: IndianRupee, tone: 'amber' as const, title: 'Budget Aware', desc: 'Trips that fit your wallet' },
  { icon: Clock, tone: 'sky' as const, title: 'Time Optimized', desc: 'Make the most of your time' },
  { icon: CloudSun, tone: 'sky' as const, title: 'Real-world Aware', desc: 'Conditions and constraints considered' },
  { icon: HeartHandshake, tone: 'coral' as const, title: 'Inclusive Travel', desc: 'Designed for different traveler needs' },
]

export function FeatureStrip() {
  return (
    <section className="border-b border-ink/6 bg-white">
      <div className="container-app">
        <div className="scrollbar-none -mx-6 flex snap-x gap-6 overflow-x-auto px-6 py-8 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex min-w-[220px] shrink-0 items-start gap-3.5 snap-start sm:min-w-0">
              <IconCircle tone={f.tone} size="md">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </IconCircle>
              <div>
                <p className="text-[15px] font-bold text-ink">{f.title}</p>
                <p className="text-sm text-ink-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
