import { Link } from 'react-router-dom'
import { Compass, TreePine, Leaf } from 'lucide-react'

const LINK_COLUMNS = [
  {
    heading: 'Discover',
    links: [
      { to: '/explore', label: 'Explore Destinations' },
      { to: '/plan', label: 'Plan a Trip' },
      { to: '/how-it-works', label: 'How YatraAI Works' },
    ],
  },
  {
    heading: 'Product',
    links: [
      { to: '/trips', label: 'My Trips' },
      { to: '/group-match', label: 'Group Travel Match' },
      { to: '/profile', label: 'Profile' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand-100 bg-mint">
      <div className="pointer-events-none absolute -left-4 bottom-0 flex gap-1 opacity-40 sm:opacity-60">
        <TreePine className="h-16 w-16 text-brand-400" />
        <TreePine className="h-20 w-20 text-brand-500" />
        <TreePine className="h-14 w-14 text-brand-400" />
      </div>

      <div className="container-app relative py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                <Compass className="h-5 w-5 text-brand-600" />
              </span>
              <span className="text-lg font-extrabold text-ink">
                Yatra<span className="text-brand-600">AI</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm font-medium text-ink-soft">Plan Smarter. Travel Better.</p>
            <p className="mt-4 max-w-sm font-hand text-2xl text-brand-700">
              Let&rsquo;s make tourism more meaningful &mdash; together.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm font-medium text-ink-soft transition hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Travel Responsibly</h3>
            <p className="flex items-start gap-2 text-sm text-ink-soft">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              Support local communities, respect nature and leave only footprints.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-brand-200/60 pt-6 text-xs text-ink-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} YatraAI. Built for a hackathon demo &mdash; not a real booking platform.</p>
          <p>Explore. Experience. Belong.</p>
        </div>
      </div>
    </footer>
  )
}
