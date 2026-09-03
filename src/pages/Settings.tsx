import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import profile from '../assets/profile.jpg'
import { localeNames, locales, useLocale, type Locale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'credits', label: 'Credits' },
  { id: 'danger', label: 'Danger zone' },
]

const timezones = ['UTC', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo']

const newBackupCodes = () =>
  Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 10))

const labelClass = 'mb-1 block text-sm font-medium text-ink'

function ProfileCard() {
  const { locale, setLocale } = useLocale()

  return (
    <section id="profile" className="card scroll-mt-20 p-6">
      <div className="flex items-center gap-4">
        <img src={profile} alt="" className="h-16 w-16 rounded-full object-cover" />
        <div className="flex-1">
          <h2 className="font-medium text-ink">Luna Admin</h2>
          <p className="text-sm text-ink-subtle">luna@company.io</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-xs"
          onClick={() => toast('Avatar upload is not wired up yet')}
        >
          Change avatar
        </button>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          toast.success('Profile updated')
        }}
      >
        <div className="mt-6 grid gap-x-8 gap-y-4 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Full name</label>
            <input type="text" defaultValue="Luna Admin" name="name" id="name" className="input" />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email address</label>
            <input type="email" defaultValue="luna@company.io" name="email" id="email" className="input" />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input type="tel" defaultValue="" name="phone" id="phone" className="input" />
          </div>
          <div>
            <label className={labelClass} htmlFor="timezone">Timezone</label>
            <select name="timezone" id="timezone" defaultValue="Europe/Paris" className="input">
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="language">Language</label>
            <select
              id="language"
              className="input"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              {locales.map((l) => (
                <option key={l} value={l}>{localeNames[l]}</option>
              ))}
            </select>
            <span className="text-xs text-ink-subtle">Applies immediately across the app</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn btn-primary">Save profile</button>
        </div>
      </form>
    </section>
  )
}

function SecurityCard() {
  const [mfaEnabled, setMfaEnabled] = useLocalStorage('mfaEnabled', false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)

  return (
    <section id="security" className="card scroll-mt-20 p-6">
      <h2 className="text-card-title text-ink">Security</h2>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          if (data.get('newPassword') !== data.get('repeatPassword')) {
            toast.error('New passwords do not match')
            return
          }
          toast.success('Password changed')
          e.currentTarget.reset()
        }}
      >
        <div className="mt-4 grid gap-x-8 gap-y-4 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="currentPassword">Current password</label>
            <input type="password" required name="currentPassword" id="currentPassword" className="input" />
          </div>
          <div>
            <label className={labelClass} htmlFor="newPassword">New password</label>
            <input type="password" required name="newPassword" id="newPassword" className="input" />
          </div>
          <div>
            <label className={labelClass} htmlFor="repeatPassword">Repeat new password</label>
            <input type="password" required name="repeatPassword" id="repeatPassword" className="input" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn btn-primary">Change password</button>
        </div>
      </form>
      <hr className="my-6 border-hairline" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink">Two-factor authentication</h3>
          <p className="text-xs text-ink-subtle">A one-time code from an authenticator app on every login.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink">
            {mfaEnabled ? 'Enabled' : 'Disabled'}
          </span>
          {mfaEnabled ? (
            <>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => {
                  setBackupCodes(newBackupCodes())
                  toast.success('New backup codes generated')
                }}
              >
                Regenerate codes
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => {
                  setMfaEnabled(false)
                  setBackupCodes(null)
                  toast('Two-factor authentication disabled')
                }}
              >
                Disable
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-xs"
              onClick={() => {
                setMfaEnabled(true)
                setBackupCodes(newBackupCodes())
                toast.success('Two-factor authentication enabled')
              }}
            >
              Enable
            </button>
          )}
        </div>
      </div>
      {backupCodes && (
        <div className="mt-4 rounded-lg bg-surface-2 p-4">
          <p className="mb-2 text-xs text-ink-subtle">
            Store these backup codes safely — they are shown only once.
          </p>
          <div className="grid grid-cols-2 gap-1 font-mono text-xs text-ink sm:grid-cols-4">
            {backupCodes.map((code) => (
              <span key={code}>{code}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function CreditsCard() {
  return (
    <section id="credits" className="card scroll-mt-20 p-6">
      <h2 className="text-card-title text-ink">Credits</h2>
      <p className="mt-1 text-sm text-ink-subtle">Buy credits to run scraping jobs.</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-3xl font-bold text-ink">247</span>
          <span className="ml-1 text-sm text-ink-subtle">credits remaining</span>
        </div>
        <Link to="/credits" className="btn btn-primary">Buy credits</Link>
      </div>
    </section>
  )
}

function DangerCard() {
  const [deleteArmed, setDeleteArmed] = useState(false)

  return (
    <section id="danger" className="card scroll-mt-20 border-error/40 bg-error/5 p-6">
      <h2 className="text-card-title text-error">Danger zone</h2>
      <p className="mt-1 text-sm text-ink-subtle">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (!deleteArmed) {
              setDeleteArmed(true)
              return
            }
            setDeleteArmed(false)
            toast.error('Account deletion is not wired up yet')
          }}
        >
          {deleteArmed ? 'Click again to confirm deletion' : 'Delete account'}
        </button>
      </div>
    </section>
  )
}

export default function Settings() {
  return (
    <div className="mx-auto max-w-[960px]">
      <h1 className="text-headline mb-6 text-ink">Settings</h1>
      <div className="mb-4 lg:hidden">
        <label className="sr-only" htmlFor="settings-section">Settings section</label>
        <select
          id="settings-section"
          className="input"
          defaultValue="profile"
          onChange={(e) => document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' })}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-8">
        <nav className="hidden w-[200px] shrink-0 lg:block" aria-label="Settings sections">
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex-1 space-y-6">
          <ProfileCard />
          <SecurityCard />
          <CreditsCard />
          <DangerCard />
        </div>
      </div>
    </div>
  )
}
