import { MagnetStraight, MagnifyingGlass } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export default function NotFound() {
  useEffect(() => {
    document.title = 'LeadEasyGen — Page not found'
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas p-4 text-center">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <MagnetStraight className="h-5 w-5 text-on-primary" aria-hidden="true" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-ink">LeadEasyGen</span>
      </div>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MagnifyingGlass className="h-9 w-9 text-link" aria-hidden="true" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-ink">404</h1>
      <p className="mt-2 text-lg font-medium text-ink">Page not found</p>
      <p className="mt-1 max-w-md text-sm text-ink-subtle">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link to="/">Back to Dashboard</Link>
      </Button>
    </main>
  )
}
