import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint text-brand-600">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="text-3xl font-extrabold text-ink">Looks like you&rsquo;re off the map.</h1>
      <p className="mt-2 max-w-sm text-ink-muted">The page you&rsquo;re looking for doesn&rsquo;t exist. Let&rsquo;s get you back on route.</p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="md">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
