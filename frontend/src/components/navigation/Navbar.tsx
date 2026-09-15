import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Compass, Menu, Search, X } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { Button } from '@/components/common/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/plan', label: 'Plan Trip' },
  { to: '/trips', label: 'My Trips' },
  { to: '/how-it-works', label: 'About' },
]

export function Navbar() {
  const location = useLocation()
  const scrolled = useScrolled(40)
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled && !menuOpen

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        transparent ? 'bg-transparent' : 'border-b border-ink/8 bg-white/95 backdrop-blur-md'
      }`}
    >
      <nav className="container-app flex h-20 items-center justify-between" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2.5" aria-label="YatraAI home">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${transparent ? 'bg-white/90' : 'bg-brand-50'}`}
          >
            <Compass className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className={`block text-lg font-extrabold tracking-tight ${transparent ? 'text-white' : 'text-ink'}`}>
              Yatra<span className="text-brand-500">AI</span>
            </span>
            <span className={`block text-[11px] font-medium ${transparent ? 'text-white/75' : 'text-ink-muted'}`}>
              Plan Smarter. Travel Better.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? transparent
                      ? 'text-white'
                      : 'text-brand-700'
                    : transparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full ${transparent ? 'bg-white' : 'bg-brand-600'}`}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search destinations"
            className={`hidden h-11 w-11 items-center justify-center rounded-full transition sm:inline-flex ${
              transparent ? 'text-white hover:bg-white/15' : 'text-ink-soft hover:bg-ink/5'
            }`}
          >
            <Search className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant={transparent ? 'ghost' : 'outline'}
              size="sm"
              className={transparent ? 'border border-white/40 text-white hover:bg-white/10' : ''}
            >
              Login
            </Button>
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </div>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition lg:hidden ${
              transparent ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-ink/5'
            }`}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink/8 bg-white px-6 pb-6 pt-2 shadow-card lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `min-h-[44px] rounded-xl px-3 py-3 text-[15px] font-semibold ${isActive ? 'bg-mint text-brand-700' : 'text-ink-soft'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="md" fullWidth>
              Login
            </Button>
            <Button variant="primary" size="md" fullWidth>
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
