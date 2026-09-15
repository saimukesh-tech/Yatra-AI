import type { ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'ai'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-brand-50 text-brand-700',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-danger-50 text-danger-600',
  info: 'bg-sky-50 text-sky-600',
  neutral: 'bg-ink/5 text-ink-soft',
  ai: 'bg-brand-700 text-white',
}

const DEFAULT_ICONS: Record<BadgeVariant, typeof CheckCircle2 | null> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
  neutral: null,
  ai: Sparkles,
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  icon?: ReactNode | null
  className?: string
}

export function Badge({ variant = 'neutral', children, icon, className = '' }: BadgeProps) {
  const Icon = DEFAULT_ICONS[variant]
  const resolvedIcon = icon === undefined ? (Icon ? <Icon className="h-3.5 w-3.5" /> : null) : icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {resolvedIcon}
      {children}
    </span>
  )
}
