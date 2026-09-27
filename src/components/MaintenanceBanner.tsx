import { WarningCircle } from '@phosphor-icons/react'
import { useFlag, useRemoteConfig } from '@fonderie/react'

// An operator-set notice shown to everyone — signed in or not — without a
// deploy: set MAINTENANCE_MESSAGE in /_admin → Config & secrets and every open
// tab shows it within five minutes (a fresh page load shows it at once);
// clear it and the banner goes away. Rendered as plain text, never HTML.
//
// '' is the safe fallback: before the config loads, or if it cannot be
// reached, there is simply no banner.
const REFRESH_MS = 5 * 60_000

export function MaintenanceBanner({ className = '' }: { className?: string }) {
  useRemoteConfig({ refreshMs: REFRESH_MS })
  const raw = useFlag<unknown>('MAINTENANCE_MESSAGE', '')
  const message = typeof raw === 'string' ? raw.trim() : ''
  if (!message) return null
  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink ${className}`}
    >
      <WarningCircle size={18} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-warning" />
      <span>{message}</span>
    </div>
  )
}
