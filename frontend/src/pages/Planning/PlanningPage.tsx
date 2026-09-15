import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useTripContext } from '@/context/TripContext'
import { useItinerary, PLANNING_STAGES } from '@/hooks/useItinerary'
import { ProgressIndicator, type ProgressStep } from '@/components/common/ProgressIndicator'
import { ErrorState } from '@/components/common/ErrorState'
import { SceneVisual } from '@/components/ui/SceneVisual'

const STAGE_INTERVAL_MS = 420

export function PlanningPage() {
  const navigate = useNavigate()
  const { tripInput } = useTripContext()
  const { generate, error } = useItinerary()
  const [stageIndex, setStageIndex] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!tripInput.destinationName || tripInput.interests.length === 0) {
      navigate('/plan', { replace: true })
      return
    }
    if (hasStarted.current) return
    hasStarted.current = true

    let cancelled = false
    const generationPromise = generate(tripInput).catch(() => null)

    const interval = window.setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= PLANNING_STAGES.length) {
          window.clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, STAGE_INTERVAL_MS)

    const minimumDisplay = new Promise((resolve) =>
      window.setTimeout(resolve, STAGE_INTERVAL_MS * PLANNING_STAGES.length + 300),
    )

    Promise.all([generationPromise, minimumDisplay]).then(([itinerary]) => {
      if (cancelled) return
      window.clearInterval(interval)
      if (itinerary) {
        navigate('/itinerary', { replace: true })
      }
    })

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const steps: ProgressStep[] = PLANNING_STAGES.map((label, i) => ({
    label,
    status: i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'pending',
  }))

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ink px-6 py-16">
        <ErrorState
          title="AI couldn't generate a plan"
          description="Something interrupted the planning process. Let's try again."
          onRetry={() => navigate('/plan')}
          className="max-w-md bg-white"
        />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-ink py-16">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <SceneVisual variant="mountain" seed={9} className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <path
          d="M -50 400 Q 300 200 600 380 T 1300 300"
          fill="none"
          stroke="#3DA37F"
          strokeWidth="2"
          strokeDasharray="10 10"
          strokeDashoffset="1000"
          pathLength={1000}
          className="animate-dash"
        />
      </svg>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-brand-600/20 text-brand-300">
          <Compass className="h-8 w-8 animate-[spin_6s_linear_infinite]" />
        </span>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Designing your perfect trip&hellip;</h1>
        <p className="mt-2 text-sm text-white/60">
          For {tripInput.destinationName} &middot; {tripInput.durationDays} day
          {tripInput.durationDays !== 1 ? 's' : ''}
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
          <ProgressIndicator steps={steps} />
        </div>
      </div>
    </div>
  )
}
