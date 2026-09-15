import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { mockDestinations } from '@/data/mockDestinations'
import type { Destination } from '@/types/trip'
import { Input } from '@/components/common/Input'
import { DestinationGrid } from '@/components/destinations/DestinationGrid'

const FILTERS = ['Nature', 'History', 'Food', 'Adventure', 'Culture', 'Beach', 'Mountains'] as const

const matchesFilter = (destination: Destination, filter: string): boolean => {
  const cats = destination.categories.map((c) => c.toLowerCase())
  const best = destination.bestFor.map((b) => b.toLowerCase())
  switch (filter) {
    case 'Nature':
      return best.includes('nature') || cats.some((c) => c.includes('nature'))
    case 'History':
      return best.includes('history') || cats.some((c) => c.includes('history') || c.includes('heritage'))
    case 'Food':
      return best.includes('food') || cats.some((c) => c.includes('food'))
    case 'Adventure':
      return best.includes('adventure') || cats.some((c) => c.includes('adventure'))
    case 'Culture':
      return cats.some((c) => c.includes('culture')) || best.includes('spiritual')
    case 'Beach':
      return destination.sceneType === 'beach' || cats.some((c) => c.includes('beach'))
    case 'Mountains':
      return destination.sceneType === 'mountain' || destination.sceneType === 'hills'
    default:
      return true
  }
}

export function ExplorePage() {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const filtered = useMemo(() => {
    return mockDestinations.filter((d) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q)
      const matchesFilters = activeFilters.length === 0 || activeFilters.every((f) => matchesFilter(d, f))
      return matchesQuery && matchesFilters
    })
  }, [query, activeFilters])

  return (
    <div className="bg-cream py-12 sm:py-16">
      <div className="container-app">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Discover</p>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Where do you want to explore?</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Browse destinations across India, then jump straight into a personalized plan.
        </p>

        <div className="mt-6 max-w-lg">
          <Input
            iconLeft={<Search className="h-4 w-4" />}
            placeholder="Search by city, state or vibe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search destinations"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeFilters.includes(filter)
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-ink/12 bg-white text-ink-soft hover:border-brand-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="mt-4">
          <DestinationGrid destinations={filtered} variant="detailed" />
        </div>
      </div>
    </div>
  )
}
