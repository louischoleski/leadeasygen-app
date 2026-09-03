import { MagnetStraight } from '@phosphor-icons/react'
import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-canvas p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-3 md:top-8 md:left-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <MagnetStraight className="h-5 w-5 text-on-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">LeadEasyGen</span>
          <span className="text-xs text-ink-subtle">Lead generation</span>
        </div>
      </Link>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
