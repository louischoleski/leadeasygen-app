import { MagnetStraight } from '@phosphor-icons/react'
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LegalPageProps {
  title: string
  children: ReactNode
}

export function LegalPage({ title, children }: LegalPageProps) {
  useEffect(() => {
    document.title = `LeadEasyGen — ${title}`
  }, [title])

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MagnetStraight className="h-5 w-5 text-on-primary" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-ink">LeadEasyGen</span>
        </Link>
        <h1 className="mt-10 text-3xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-subtle">Last updated: June 1, 2025</p>
        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </main>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-ink">{heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{children}</p>
    </section>
  )
}
