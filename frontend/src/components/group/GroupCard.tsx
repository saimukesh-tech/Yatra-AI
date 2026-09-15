import { MapPin, HeartHandshake, Clock3, Wallet, CheckCircle2, Users } from 'lucide-react'
import type { TravelerGroup } from '@/types/traveler'
import { CompatibilityRing } from './CompatibilityRing'
import { Button } from '@/components/common/Button'

interface GroupCardProps {
  group: TravelerGroup
  onView: (group: TravelerGroup) => void
  isLoading?: boolean
}

const BREAKDOWN_ROWS = [
  { key: 'destinationMatch', label: 'Destination Match', icon: MapPin },
  { key: 'interestMatch', label: 'Interest Match', icon: HeartHandshake },
  { key: 'timeMatch', label: 'Time Compatibility', icon: Clock3 },
  { key: 'budgetMatch', label: 'Budget Compatibility', icon: Wallet },
] as const

export function GroupCard({ group, onView, isLoading }: GroupCardProps) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-brand-700">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold text-ink">{group.label}</p>
            <p className="text-sm text-ink-muted">{group.travelerCount} compatible travelers</p>
          </div>
        </div>
        <CompatibilityRing value={group.compatibility.overall} label="Overall" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BREAKDOWN_ROWS.map((row) => (
          <div key={row.key} className="rounded-2xl bg-cream p-3 text-center">
            <row.icon className="mx-auto mb-1.5 h-4 w-4 text-brand-600" />
            <p className="text-base font-extrabold text-ink">{group.compatibility[row.key]}%</p>
            <p className="text-[11px] font-semibold text-ink-muted">{row.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-ink/6 pt-5">
        <p className="mb-2.5 text-sm font-bold text-ink">Why this group?</p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {group.reasons.map((reason) => (
            <li key={reason} className="flex items-center gap-2 text-sm text-ink-soft">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="primary" size="md" className="mt-6" loading={isLoading} onClick={() => onView(group)}>
        View Group
      </Button>
    </div>
  )
}
