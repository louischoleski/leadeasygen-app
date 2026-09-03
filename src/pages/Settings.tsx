import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Envelope, Phone, User } from '@phosphor-icons/react'
import profile from '../assets/profile.jpg'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Toggle } from '../components/Toggle'
import { useAuth } from '../data/auth'
import { subscriptionTiers, useBilling } from '../data/billing'
import { localeNames, locales, useLocale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'credits', label: 'Credits' },
  { id: 'danger', label: 'Danger zone' },
]

const timezoneOptions = ['UTC', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo'].map(
  (tz) => ({ value: tz, label: tz }),
)
const languageOptions = locales.map((l) => ({ value: l, label: localeNames[l] }))

const newBackupCodes = () =>
  Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 10))

const labelClass = 'mb-1 block text-sm font-medium text-ink'

function ProfileCard() {
  const { locale, setLocale } = useLocale()
  const { user } = useAuth()

  return (
    <Card as="section" id="profile" className="scroll-mt-20 p-5">
      <div className="flex items-center gap-3">
        <img src={profile} alt="" className="h-16 w-16 rounded-full object-cover" />
        <div className="flex-1">
          <h2 className="font-medium text-ink">{user?.name}</h2>
          <p className="text-sm text-ink-subtle">{user?.email}</p>
        </div>
        <Button variant="secondary" size="xs" onClick={() => toast('Avatar upload is not wired up yet')}>
          Change avatar
        </Button>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          toast.success('Profile updated')
        }}
      >
        <div className="mt-4 grid gap-x-6 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
          <Input label="Full name" name="name" id="name" defaultValue={user?.name ?? ''} iconLeft={User} />
          <Input
            label="Email address"
            type="email"
            id="email"
            value={user?.email ?? ''}
            disabled
            iconLeft={Envelope}
            helperText="Contact support to change your email"
          />
          <Input
            label="Phone"
            name="phone"
            id="phone"
            type="tel"
            format="phone"
            iconLeft={Phone}
            placeholder="(555) 000-0000"
          />
          <div>
            <label className={labelClass} htmlFor="timezone">Timezone</label>
            <Select
              inputId="timezone"
              name="timezone"
              options={timezoneOptions}
              defaultValue={timezoneOptions.find((o) => o.value === 'Europe/Paris')}
              isSearchable
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="language">Language</label>
            <Select
              inputId="language"
              options={languageOptions}
              value={languageOptions.find((o) => o.value === locale)}
              onChange={(option) => option && setLocale(option.value)}
              placeholder="Select language..."
              isSearchable
            />
            <p className="mt-1 text-xs text-ink-subtle">Applies immediately across the app</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </Card>
  )
}

function SecurityCard() {
  const [mfaEnabled, setMfaEnabled] = useLocalStorage('mfaEnabled', false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)

  return (
    <Card as="section" id="security" className="scroll-mt-20 p-5">
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
        <div className="mt-4 grid gap-x-6 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
          <Input label="Current password" type="password" required name="currentPassword" id="currentPassword" />
          <Input label="New password" type="password" required name="newPassword" id="newPassword" />
          <Input label="Repeat new password" type="password" required name="repeatPassword" id="repeatPassword" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit">Change password</Button>
        </div>
      </form>
      <hr className="my-4 border-hairline" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink">Two-factor authentication</h3>
          <p className="text-xs text-ink-subtle">A one-time code from an authenticator app on every login.</p>
        </div>
        <div className="flex items-center gap-2">
          {mfaEnabled && (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => {
                setBackupCodes(newBackupCodes())
                toast.success('New backup codes generated')
              }}
            >
              Regenerate codes
            </Button>
          )}
          <Toggle
            pressed={mfaEnabled}
            onPressedChange={(next) => {
              setMfaEnabled(next)
              setBackupCodes(next ? newBackupCodes() : null)
              if (next) toast.success('Two-factor authentication enabled')
              else toast('Two-factor authentication disabled')
            }}
            unpressedLabel="Disabled"
            pressedLabel="Enabled"
            aria-label="Two-factor authentication"
          />
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
    </Card>
  )
}

function CreditsCard() {
  const { creditBalance, subscriptionTier } = useBilling()
  const tier = subscriptionTiers.find((t) => t.id === subscriptionTier)
  const planLabel = tier ? `the ${tier.name} plan` : 'pay-as-you-go'

  return (
    <Card as="section" id="credits" className="scroll-mt-20 flex flex-wrap items-center justify-between gap-3 p-5">
      <div>
        <h2 className="text-card-title text-ink">Credits</h2>
        <p className="mt-1 text-sm text-ink-subtle">
          You're on {planLabel}. Credits are spent per scraping job.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-3">
          <span className="text-3xl font-bold text-ink">{creditBalance}</span>
          <span className="ml-1 text-sm text-ink-subtle">remaining</span>
        </div>
        <Button asChild><Link to="/billing#packages">Buy credits</Link></Button>
        <Button asChild variant="secondary"><Link to="/billing">Manage billing</Link></Button>
      </div>
    </Card>
  )
}

function DangerCard() {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <Card as="section" id="danger" className="scroll-mt-20 border-error/40 bg-error/5 p-5">
      <h2 className="text-card-title text-error">Danger zone</h2>
      <p className="mt-1 text-sm text-ink-subtle">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>
      <div className="mt-4">
        <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
          Delete account
        </Button>
      </div>
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete account?"
        description="All jobs, results, and remaining credits are permanently removed. This cannot be undone."
        confirmLabel="Delete account"
        danger
        onConfirm={() => {
          setConfirmingDelete(false)
          toast.error('Account deletion is not wired up yet')
        }}
        onClose={() => setConfirmingDelete(false)}
      />
    </Card>
  )
}

export default function Settings() {
  return (
    <div className="w-full">
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
        <nav className="hidden w-[180px] shrink-0 lg:block" aria-label="Settings sections">
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
        <div className="min-w-0 flex-1 space-y-4">
          <ProfileCard />
          <SecurityCard />
          <CreditsCard />
          <DangerCard />
        </div>
      </div>
    </div>
  )
}
