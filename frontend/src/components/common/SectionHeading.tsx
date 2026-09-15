import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  linkTo?: string
  linkLabel?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  linkTo,
  linkLabel = 'View All',
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'text-center sm:text-center' : ''} ${className}`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        )}
        <h2 className="text-balance text-3xl font-extrabold text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {subtitle && <p className="mt-3 text-balance text-base text-ink-muted sm:text-lg">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-brand-700 transition hover:gap-2.5 sm:self-auto"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
