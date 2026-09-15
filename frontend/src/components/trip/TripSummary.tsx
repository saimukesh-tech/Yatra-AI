import { MapPin, Wallet, Clock3, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { TripInput } from '@/types/trip'
import { Button } from '@/components/common/Button'
import { InterestIcon, interestLabel } from '@/components/trip/InterestChip'
import { formatCurrency, durationLabel } from '@/utils/budget'

interface TripSummaryProps {
  input: TripInput
  onGenerate: () => void
  isGenerating?: boolean
  isReady: boolean
  className?: string
}

export function TripSummary({ input, onGenerate, isGenerating, isReady, className = '' }: TripSummaryProps) {
  return (
    <div className={`rounded-3xl border border-ink/8 bg-white p-6 shadow-card ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">Your Trip</p>

      <dl className="mt-4 space-y-3.5">
        <div className="flex items-center gap-3">
          <MapPin className="h-4.5 w-4.5 shrink-0 text-ink-muted" />
          <dd className={`text-[15px] font-semibold ${input.destinationName ? 'text-ink' : 'text-ink-muted'}`}>
            {input.destinationName || 'Choose a destination'}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Wallet className="h-4.5 w-4.5 shrink-0 text-ink-muted" />
          <dd className="text-[15px] font-semibold text-ink">
            {formatCurrency(input.budgetMin)} &ndash; {formatCurrency(input.budgetMax)}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="h-4.5 w-4.5 shrink-0 text-ink-muted" />
          <dd className="text-[15px] font-semibold text-ink">
            {durationLabel(input.durationDays, input.durationNights)}
          </dd>
        </div>
      </dl>

      {input.interests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/6 pt-4">
          {input.interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-brand-700"
            >
              <InterestIcon interest={interest} className="h-3.5 w-3.5" />
              {interestLabel(interest)}
            </span>
          ))}
        </div>
      )}

      {input.constraints.trim() && (
        <div className="mt-4 flex items-start gap-2 border-t border-ink/6 pt-4 text-sm text-ink-muted">
          <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="line-clamp-3">{input.constraints}</p>
        </div>
      )}

      <div className="mt-6 border-t border-ink/6 pt-5">
        <p className="mb-3 text-sm font-semibold text-ink">Ready to plan?</p>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isReady}
          loading={isGenerating}
          onClick={onGenerate}
          iconLeft={!isGenerating ? <Sparkles className="h-4 w-4" /> : undefined}
        >
          {isGenerating ? 'Designing your trip...' : 'Generate My Trip'}
        </Button>
        {!isReady && (
          <p className="mt-2 text-center text-xs text-ink-muted">
            Pick a destination and at least one interest to continue.
          </p>
        )}
      </div>
    </div>
  )
}
