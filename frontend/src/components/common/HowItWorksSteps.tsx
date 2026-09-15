export interface HowItWorksStep {
  number: string
  title: string
  description?: string
}

interface HowItWorksStepsProps {
  steps: HowItWorksStep[]
  className?: string
}

export function HowItWorksSteps({ steps, className = '' }: HowItWorksStepsProps) {
  return (
    <div className={`relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <div
        className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-brand-200 lg:block"
        aria-hidden="true"
      />
      {steps.map((step) => (
        <div key={step.number} className="relative flex flex-col items-start gap-3">
          <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 font-display text-lg font-extrabold text-white shadow-lift">
            {step.number}
          </span>
          <p className="text-lg font-bold text-ink">{step.title}</p>
          {step.description && <p className="text-sm text-ink-muted">{step.description}</p>}
        </div>
      ))}
    </div>
  )
}
