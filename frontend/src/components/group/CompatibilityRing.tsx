interface CompatibilityRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function CompatibilityRing({ value, size = 96, strokeWidth = 9, label, className = '' }: CompatibilityRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference

  const color = value >= 80 ? '#087F5B' : value >= 60 ? '#E8A93A' : '#D9483A'

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#102A2E" strokeWidth={strokeWidth} opacity="0.08" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-ink">{value}%</span>
        {label && <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{label}</span>}
      </div>
    </div>
  )
}
