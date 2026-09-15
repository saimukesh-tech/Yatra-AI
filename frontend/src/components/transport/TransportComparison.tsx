import { Car, Bus, PiggyBank, Info } from 'lucide-react'
import type { TransportComparison as TransportComparisonType } from '@/types/transport'
import { formatCurrency } from '@/utils/budget'

interface TransportComparisonProps {
  comparison: TransportComparisonType
  className?: string
}

export function TransportComparison({ comparison, className = '' }: TransportComparisonProps) {
  return (
    <div className={`rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:p-7 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-lg font-bold text-ink">Smart Transport Recommendation</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600">
          <Info className="h-3 w-3" /> Estimated
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-ink/8 p-5 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
            <Car className="h-6 w-6" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Individual Travel</p>
          <p className="mt-1 text-sm text-ink-soft">{comparison.individual.rideCount} separate rides</p>
          <p className="mt-3 text-2xl font-extrabold text-ink">{formatCurrency(comparison.individual.totalCost)}</p>
          <p className="text-xs text-ink-muted">Estimated total</p>
        </div>

        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xs font-bold text-white sm:h-8 sm:w-8">
          VS
        </div>

        <div className="rounded-2xl border-2 border-brand-500 bg-mint/40 p-5 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
            <Bus className="h-6 w-6" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Shared Travel</p>
          <p className="mt-1 text-sm text-ink-soft">{comparison.shared.vehicle} &middot; up to {comparison.shared.capacity}</p>
          <p className="mt-3 text-2xl font-extrabold text-brand-700">{formatCurrency(comparison.shared.totalCost)}</p>
          <p className="text-xs text-ink-muted">Estimated total</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-700 px-5 py-4 text-center text-white">
        <p className="flex items-center gap-2 text-lg font-extrabold">
          <PiggyBank className="h-5 w-5" /> Estimated saving: {formatCurrency(comparison.savingsTotal)} total
        </p>
        <p className="text-sm text-white/80">{formatCurrency(comparison.savingsPerPerson)} per person</p>
      </div>

      <p className="mt-3 text-center text-xs text-ink-muted">
        These figures are estimates for planning purposes only. No vehicle has been booked — YatraAI isn&rsquo;t connected to a real transport booking API in this demo.
      </p>
    </div>
  )
}
