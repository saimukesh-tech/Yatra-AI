import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = '', rows = 4, ...rest }, ref) => {
    const autoId = useId()
    const areaId = id ?? autoId
    const describedBy = error ? `${areaId}-error` : helperText ? `${areaId}-helper` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 ${error ? 'border-danger-500' : 'border-ink/12'} ${className}`}
          {...rest}
        />
        {error && (
          <p id={`${areaId}-error`} className="mt-1.5 text-sm text-danger-500">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${areaId}-helper`} className="mt-1.5 text-sm text-ink-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
