import { MagnetStraight } from '@phosphor-icons/react'
import { Link, Outlet } from 'react-router-dom'
import LocaleSwitcher from '../components/LocaleSwitcher'
import { useTranslation } from '../hooks/useTranslation'

export default function AuthLayout() {
  const { t } = useTranslation()
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-canvas p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-3 md:top-8 md:left-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <MagnetStraight className="h-5 w-5 text-on-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-ink">{t('common.appName')}</span>
          <span className="text-xs text-ink-subtle">{t('auth.layout.tagline')}</span>
        </div>
      </Link>
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
