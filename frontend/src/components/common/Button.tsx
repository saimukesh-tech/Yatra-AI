import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft hover:shadow-lift disabled:bg-brand-600/50',
  secondary:
    'bg-mint text-brand-700 hover:bg-mint-dark active:bg-brand-100 disabled:opacity-50',
  outline:
    'bg-white text-ink border border-ink/15 hover:border-brand-600 hover:text-brand-700 disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 disabled:opacity-50',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:opacity-50',
  success: 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2 gap-1.5 min-h-[38px]',
  md: 'text-[15px] px-5 py-3 gap-2 min-h-[44px]',
  lg: 'text-base px-7 py-4 gap-2.5 min-h-[52px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...rest}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          iconLeft && <span className="inline-flex shrink-0 items-center">{iconLeft}</span>
        )}
        <span>{children}</span>
        {!loading && iconRight && <span className="inline-flex shrink-0 items-center">{iconRight}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
