import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

export interface ProgressStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  className?: string
}

export function ProgressIndicator({ steps, className = '' }: ProgressIndicatorProps) {
  return (
    <ol className={`space-y-3.5 ${className}`}>
      {steps.map((step, i) => (
        <li
          key={step.label}
          className={`flex items-center gap-3 transition-opacity duration-500 ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <span className="shrink-0">
            {step.status === 'done' && <CheckCircle2 className="h-5 w-5 text-brand-500" aria-hidden="true" />}
            {step.status === 'active' && <Loader2 className="h-5 w-5 animate-spin text-brand-500" aria-hidden="true" />}
            {step.status === 'pending' && <Circle className="h-5 w-5 text-white/30" aria-hidden="true" />}
          </span>
          <span
            className={`text-[15px] ${step.status === 'done' ? 'text-white/70 line-through decoration-white/30' : step.status === 'active' ? 'font-semibold text-white' : 'text-white/50'}`}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}

interface StepperProps {
  steps: string[]
  currentIndex: number
  className?: string
}

export function Stepper({ steps, currentIndex, className = '' }: StepperProps) {
  return (
    <ol className={`flex flex-col gap-0 ${className}`}>
      {steps.map((label, i) => {
        const status = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending'
        return (
          <li key={label} className="relative flex gap-3 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className={`absolute left-[13px] top-7 h-full w-0.5 ${status === 'done' ? 'bg-brand-500' : 'bg-ink/10'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                status === 'done'
                  ? 'bg-brand-600 text-white'
                  : status === 'active'
                    ? 'border-2 border-brand-600 bg-white text-brand-700'
                    : 'border border-ink/15 bg-white text-ink-muted'
              }`}
            >
              {status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={`pt-0.5 text-sm font-semibold ${status === 'pending' ? 'text-ink-muted' : 'text-ink'}`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
