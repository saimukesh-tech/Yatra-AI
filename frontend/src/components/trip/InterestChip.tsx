import {
  Landmark,
  UtensilsCrossed,
  Trees,
  Mountain,
  ShoppingBag,
  Camera,
  Sparkle,
  Clapperboard,
  type LucideIcon,
} from 'lucide-react'
import type { InterestKey, InterestOption } from '@/types/trip'

export const INTEREST_OPTIONS: InterestOption[] = [
  { key: 'history', label: 'History & Culture', icon: 'Landmark' },
  { key: 'food', label: 'Food', icon: 'UtensilsCrossed' },
  { key: 'nature', label: 'Nature', icon: 'Trees' },
  { key: 'adventure', label: 'Adventure', icon: 'Mountain' },
  { key: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
  { key: 'photography', label: 'Photography', icon: 'Camera' },
  { key: 'spiritual', label: 'Spiritual', icon: 'Sparkle' },
  { key: 'entertainment', label: 'Entertainment', icon: 'Clapperboard' },
]

const ICONS: Record<string, LucideIcon> = {
  Landmark,
  UtensilsCrossed,
  Trees,
  Mountain,
  ShoppingBag,
  Camera,
  Sparkle,
  Clapperboard,
}

export const interestLabel = (key: InterestKey): string =>
  INTEREST_OPTIONS.find((o) => o.key === key)?.label ?? key

export const InterestIcon = ({ interest, className }: { interest: InterestKey; className?: string }) => {
  const option = INTEREST_OPTIONS.find((o) => o.key === interest)
  const Icon = option ? ICONS[option.icon] : Sparkle
  return <Icon className={className} aria-hidden="true" />
}

interface InterestChipProps {
  interest: InterestKey
  selected: boolean
  onToggle: (interest: InterestKey) => void
}

export function InterestChip({ interest, selected, onToggle }: InterestChipProps) {
  const option = INTEREST_OPTIONS.find((o) => o.key === interest)
  if (!option) return null
  const Icon = ICONS[option.icon]

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => onToggle(interest)}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        selected
          ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
          : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400 hover:text-brand-700'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {option.label}
    </button>
  )
}
