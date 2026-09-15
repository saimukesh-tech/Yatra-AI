import { Wallet, Clock3, HeartHandshake, Route, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { ConstraintCheckItem } from '@/types/itinerary'
import { Button } from '@/components/common/Button'

const ICONS = { budget: Wallet, time: Clock3, interest: HeartHandshake, route: Route }

const STATUS_STYLES = {
  ok: { badge: 'bg-brand-50 text-brand-700', bar: 'bg-brand-500', Icon: CheckCircle2 },
  warning: { badge: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500', Icon: AlertTriangle },
  exceeded: { badge: 'bg-danger-50 text-danger-600', bar: 'bg-danger-500', Icon: XCircle },
} as const

interface ConstraintCheckProps {
  checks: ConstraintCheckItem[]
  onFixWithAI?: () => void
  className?: string
}

export function ConstraintCheck({ checks, onFixWithAI, className = '' }: ConstraintCheckProps) {
  const hasIssue = checks.some((c) => c.status !== 'ok')

  return (
    <div className={`rounded-3xl border border-ink/8 bg-white p-6 shadow-soft ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">Trip Check</p>
        {hasIssue && onFixWithAI && (
          <Button variant="secondary" size="sm" onClick={onFixWithAI}>
            Fix with AI
          </Button>
        )}
      </div>

      <ul className="mt-4 space-y-4">
        {checks.map((check) => {
          const Icon = ICONS[check.key]
          const style = STATUS_STYLES[check.status]
          return (
            <li key={check.key}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-ink-muted" />
                  <span className="text-sm font-bold text-ink">{check.label}</span>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>
                  <style.Icon className="h-3.5 w-3.5" />
                  {check.actualLabel} / {check.targetLabel}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/6">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
                  style={{ width: `${Math.min(100, check.percent)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-muted">{check.detail}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
