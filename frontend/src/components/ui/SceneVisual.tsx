import type { SceneType } from '@/types/trip'

/**
 * YatraAI has no access to a photo library in this environment, so instead
 * of broken <img> tags this renders a signature illustrated "scene" system:
 * layered, brand-colored SVG landscapes standing in for destination
 * photography. Every card, hero panel and thumbnail in the app pulls from
 * this single component, so the illustration language stays consistent
 * (same palette, same layering, same sun/moon motif) wherever it appears.
 */

interface SceneConfig {
  sky: [string, string]
  layers: string[]
  accent: string
  deco: 'sun' | 'moon' | 'sunset'
}

const CONFIGS: Record<SceneType, SceneConfig> = {
  mountain: {
    sky: ['#DCEEF7', '#F3F8EC'],
    layers: ['#8FB9C7', '#5D93A3', '#2E5E6E'],
    accent: '#F3D27A',
    deco: 'sun',
  },
  hills: {
    sky: ['#E4F2E6', '#FBF6E4'],
    layers: ['#9FC9A8', '#5D9E6E', '#2F6B45'],
    accent: '#EDC15C',
    deco: 'sun',
  },
  beach: {
    sky: ['#CFEAF2', '#FCEFD8'],
    layers: ['#7FC2C9', '#3E97A3', '#0E5E6B'],
    accent: '#F2A65A',
    deco: 'sunset',
  },
  backwaters: {
    sky: ['#DCEFE2', '#F6F3DE'],
    layers: ['#8AC1A0', '#4C9273', '#256B4E'],
    accent: '#EFCB6E',
    deco: 'sunset',
  },
  heritage: {
    sky: ['#F4E3D3', '#FBF4E6'],
    layers: ['#D7A97B', '#B77F52', '#7A4E30'],
    accent: '#E8AA4C',
    deco: 'sun',
  },
  temple: {
    sky: ['#F5E2D0', '#FCF1E4'],
    layers: ['#D9A66B', '#B87B43', '#7C4B26'],
    accent: '#E2953F',
    deco: 'sunset',
  },
  desert: {
    sky: ['#F7E4C8', '#FDF2DE'],
    layers: ['#E3B97D', '#C99356', '#8F5F33'],
    accent: '#EF9A46',
    deco: 'sun',
  },
  city: {
    sky: ['#E4E9EC', '#F6F3EA'],
    layers: ['#A7B6BC', '#71858C', '#3E4F55'],
    accent: '#E8B94C',
    deco: 'moon',
  },
  wildlife: {
    sky: ['#E7EEDA', '#FAF7E4'],
    layers: ['#A8C186', '#6E9950', '#3E6B2C'],
    accent: '#E9B94F',
    deco: 'sun',
  },
}

const layerPath = (base: number, amp: number, seed: number): string => {
  const pts = [0, 60, 130, 200, 270, 340, 400]
  const d = pts
    .map((x, i) => {
      const y = base + Math.sin(i * 1.3 + seed) * amp
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  return `${d} L 400 300 L 0 300 Z`
}

interface SceneVisualProps {
  variant: SceneType
  className?: string
  seed?: number
  label?: string
}

export function SceneVisual({ variant, className = '', seed = 0, label }: SceneVisualProps) {
  const cfg = CONFIGS[variant]
  const uid = `${variant}-${seed}`

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cfg.sky[0]} />
          <stop offset="100%" stopColor={cfg.sky[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={cfg.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={cfg.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#sky-${uid})`} />
      <rect width="400" height="300" fill={`url(#glow-${uid})`} />

      {cfg.deco === 'sun' && <circle cx="300" cy="75" r="26" fill={cfg.accent} opacity="0.9" />}
      {cfg.deco === 'moon' && (
        <>
          <circle cx="320" cy="60" r="20" fill="#F7F1DC" opacity="0.95" />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle
              key={i}
              cx={20 + ((i * 47 + seed * 13) % 380)}
              cy={15 + ((i * 29 + seed * 7) % 90)}
              r={i % 3 === 0 ? 1.6 : 1}
              fill="#fff"
              opacity="0.8"
            />
          ))}
        </>
      )}
      {cfg.deco === 'sunset' && (
        <>
          <circle cx="330" cy="120" r="30" fill={cfg.accent} opacity="0.9" />
          <line x1="0" y1="150" x2="400" y2="150" stroke={cfg.accent} strokeOpacity="0.35" strokeWidth="2" />
        </>
      )}

      <path d={layerPath(175, 18, seed + 1)} fill={cfg.layers[0]} opacity="0.85" />
      <path d={layerPath(205, 22, seed + 2)} fill={cfg.layers[1]} opacity="0.9" />
      <path d={layerPath(240, 16, seed + 3)} fill={cfg.layers[2]} />

      {variant === 'beach' || variant === 'backwaters' ? (
        <path
          d="M0 260 Q 40 250 80 260 T 160 260 T 240 260 T 320 260 T 400 260 L 400 300 L 0 300 Z"
          fill={cfg.layers[2]}
          opacity="0.55"
        />
      ) : null}

      {variant === 'temple' || variant === 'heritage' ? (
        <g fill={cfg.layers[2]} opacity="0.9">
          <path d="M185 260 L200 210 L215 260 Z" />
          <rect x="188" y="255" width="24" height="20" />
          <path d="M150 262 L160 235 L170 262 Z" />
          <path d="M230 262 L240 235 L250 262 Z" />
        </g>
      ) : null}

      {variant === 'city' ? (
        <g fill={cfg.layers[2]} opacity="0.92">
          <rect x="60" y="200" width="26" height="70" />
          <rect x="95" y="175" width="22" height="95" />
          <rect x="125" y="215" width="30" height="55" />
          <rect x="230" y="190" width="24" height="80" />
          <rect x="262" y="160" width="20" height="110" />
          <rect x="290" y="205" width="26" height="65" />
        </g>
      ) : null}

      {variant === 'desert' ? (
        <g fill={cfg.layers[2]} opacity="0.5">
          <ellipse cx="90" cy="270" rx="60" ry="10" />
          <ellipse cx="300" cy="278" rx="70" ry="9" />
        </g>
      ) : null}

      <rect width="400" height="300" fill="black" opacity="0.02" />
    </svg>
  )
}
