import type { ReactNode } from 'react'
import { IconCircle } from './IconCircle'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  sublabel?: string
  tone?: 'brand' | 'amber' | 'sky' | 'coral' | 'ink'
  status?: 'ok' | 'warning' | 'exceeded'
  className?: string
}

const STATUS_DOT: Record<NonNullable<StatCardProps['status']>, string> = {
  ok: 'bg-brand-500',
  warning: 'bg-amber-500',
  exceeded: 'bg-danger-500',
}

export function StatCard({ icon, label, value, sublabel, tone = 'brand', status, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-ink/8 bg-white p-5 shadow-soft ${className}`}>
      <div className="flex items-start justify-between">
        <IconCircle tone={tone} size="md">
          {icon}
        </IconCircle>
        {status && (
          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-sm text-ink-muted">{sublabel}</p>}
    </div>
  )
}
