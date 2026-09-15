import type { ReactNode } from 'react'

const TONE_CLASSES: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  coral: 'bg-coral-50 text-coral-600',
  ink: 'bg-ink/5 text-ink',
  white: 'bg-white/20 text-white',
}

interface IconCircleProps {
  children: ReactNode
  tone?: keyof typeof TONE_CLASSES
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export function IconCircle({ children, tone = 'brand', size = 'md', className = '' }: IconCircleProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </div>
  )
}
