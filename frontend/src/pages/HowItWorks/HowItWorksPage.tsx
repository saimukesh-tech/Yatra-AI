import { Link } from 'react-router-dom'
import {
  UserCog,
  Brain,
  ShieldCheck,
  ListChecks,
  Users2,
  Bus,
  PiggyBank,
  ArrowDown,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { SectionHeading } from '@/components/common/SectionHeading'

const SECTIONS = [
  { icon: UserCog, title: 'Tell YatraAI your preferences.', desc: 'Destination, budget, available time, interests and any constraints — just the essentials.' },
  { icon: Brain, title: 'AI analyzes your constraints.', desc: 'Your inputs are scored against a catalogue of real attractions for your destination.' },
  { icon: ListChecks, title: 'AI creates an itinerary.', desc: 'A day-by-day plan is assembled, prioritizing what matches your interests most.' },
  { icon: ShieldCheck, title: 'AI checks and optimizes it.', desc: 'Budget, time, interest match and route efficiency are checked — and explained.' },
  { icon: Users2, title: 'AI finds compatible travelers.', desc: 'Other travelers heading the same way, at a similar time, with similar interests and budget.' },
  { icon: Bus, title: 'Shared travel can reduce estimated cost.', desc: 'A shared ride is recommended with a clear, estimated saving — never an actual booking.' },
]

const ARCHITECTURE = [
  { icon: UserCog, label: 'User Input' },
  { icon: Brain, label: 'AI Personalization' },
  { icon: ShieldCheck, label: 'Constraint Engine' },
  { icon: ListChecks, label: 'Itinerary' },
  { icon: Users2, label: 'Group Matching' },
  { icon: Bus, label: 'Shared Transport' },
  { icon: PiggyBank, label: 'Cost Savings' },
]

export function HowItWorksPage() {
  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">How YatraAI Works</p>
        <h1 className="max-w-2xl text-balance text-3xl font-extrabold text-ink sm:text-4xl">
          From a few preferences to a personalized, budget-checked, group-matched trip.
        </h1>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">Step {i + 1}</p>
              <p className="text-lg font-bold text-ink">{s.title}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <SectionHeading eyebrow="System Overview" title="The architecture, end to end." align="center" />
          <div className="mt-10 rounded-3xl border border-ink/8 bg-white p-7 sm:p-10">
            <div className="flex flex-col items-center gap-1 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-2">
              {ARCHITECTURE.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center gap-1 lg:flex-row">
                  <div className="flex flex-col items-center gap-2 px-2 py-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <p className="max-w-[100px] text-center text-xs font-bold text-ink">{step.label}</p>
                  </div>
                  {i < ARCHITECTURE.length - 1 && (
                    <>
                      <ArrowDown className="h-5 w-5 text-brand-400 lg:hidden" />
                      <ArrowRight className="hidden h-5 w-5 shrink-0 text-brand-400 lg:block" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-14 flex justify-center">
          <Link to="/plan">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Try It Yourself
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
