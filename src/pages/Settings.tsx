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
import { subscriptionTiers, useBilling } from '../data/billing'
import { useAppSession, userDisplayName } from '../lib/session'
import { localeNames, locales, useLocale } from '../hooks/useLocale'
import { useFonderieClient } from '@fonderie/react'
import { FonderieApiError, useChangePassword, useMfaSetup } from '@fonderie/react-auth'
import { OtpInput } from '../components/OtpInput'

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

const labelClass = 'mb-1 block text-sm font-medium text-ink'

function ProfileCard() {
  const { locale, setLocale } = useLocale()
  const { user, refresh } = useAppSession()
  const client = useFonderieClient()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const timezone = String(data.get('timezone') ?? '')
    const [firstName = '', ...rest] = name.split(/\s+/)
    setSaving(true)
    try {
      await client.auth.updateProfile({ firstName, lastName: rest.join(' ') })
      if (phone && phone !== user?.phone) await client.auth.updatePhone(phone)
      if (timezone) await client.auth.updatePreferences({ timezone, locale })
      await refresh({ force: true })
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" id="profile" className="scroll-mt-20 p-5">
      <div className="flex items-center gap-3">
        <img src={profile} alt="" className="h-16 w-16 rounded-full object-cover" />
        <div className="flex-1">
          <h2 className="font-medium text-ink">{userDisplayName(user)}</h2>
          <p className="text-sm text-ink-subtle">{user?.email}</p>
        </div>
        <Button variant="secondary" size="xs" onClick={() => toast('Avatar upload is not wired up yet')}>
          Change avatar
        </Button>
      </div>
      <form noValidate onSubmit={handleSubmit}>
        <div className="mt-4 grid gap-x-6 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
          <Input label="Full name" name="name" id="name" defaultValue={userDisplayName(user)} iconLeft={User} />
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
            defaultValue={user?.phone ?? ''}
          />
          <div>
            <label className={labelClass} htmlFor="timezone">Timezone</label>
            <Select
              inputId="timezone"
              name="timezone"
              options={timezoneOptions}
              defaultValue={timezoneOptions.find((o) => o.value === (user?.preferences.timezone ?? 'UTC'))}
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
          <Button type="submit" loading={saving}>Save profile</Button>
        </div>
      </form>
    </Card>
  )
}

type MfaMode = 'idle' | 'enrolling' | 'disabling' | 'regenerating'

function SecurityCard() {
  const { user, refresh } = useAppSession()
  const client = useFonderieClient()
  const { changePassword, isLoading: changingPassword } = useChangePassword()
  const { setup, setupData, verify, disable, regenerateBackupCodes, isLoading: mfaBusy } = useMfaSetup()
  const [mfaMode, setMfaMode] = useState<MfaMode>('idle')
  const [mfaCode, setMfaCode] = useState('')
  const [freshCodes, setFreshCodes] = useState<string[] | null>(null)

  const mfaEnabled = user?.mfaEnabled ?? false

  const enterMode = (mode: MfaMode) => {
    setMfaCode('')
    setFreshCodes(null)
    setMfaMode(mode)
  }

  const startEnroll = async () => {
    try {
      await setup()
      enterMode('enrolling')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start MFA setup')
    }
  }

  const submitMfaCode = async () => {
    try {
      if (mfaMode === 'enrolling') {
        try {
          await verify(mfaCode)
        } catch (err) {
          // API rejections propagate; anything else is the token-rotation
          // shape drift on older servers — server state decides below
          if (err instanceof FonderieApiError) throw err
        }
        const { result } = await client.auth.getUser({ bust: true })
        if (!result.user.mfaEnabled) throw new Error('Verification failed — try a fresh code')
        await refresh({ force: true })
        enterMode('idle')
        toast.success('Two-factor authentication enabled')
      } else if (mfaMode === 'disabling') {
        await disable(mfaCode)
        await refresh({ force: true })
        enterMode('idle')
        toast('Two-factor authentication disabled')
      } else if (mfaMode === 'regenerating') {
        const codes = await regenerateBackupCodes(mfaCode)
        setMfaMode('idle')
        setMfaCode('')
        setFreshCodes(codes)
        toast.success('New backup codes generated')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid code')
    }
  }

  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const currentPassword = String(data.get('currentPassword') ?? '')
    const newPassword = String(data.get('newPassword') ?? '')
    if (newPassword !== data.get('repeatPassword')) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Use at least 8 characters')
      return
    }
    try {
      await changePassword({ currentPassword, newPassword })
      toast.success('Password changed')
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not change password')
    }
  }

  return (
    <Card as="section" id="security" className="scroll-mt-20 p-5">
      <h2 className="text-card-title text-ink">Security</h2>
      <form noValidate onSubmit={handlePassword}>
        <div className="mt-4 grid gap-x-6 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
          <Input label="Current password" type="password" required name="currentPassword" id="currentPassword" />
          <Input label="New password" type="password" required name="newPassword" id="newPassword" />
          <Input label="Repeat new password" type="password" required name="repeatPassword" id="repeatPassword" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" loading={changingPassword}>Change password</Button>
        </div>
      </form>
      <hr className="my-4 border-hairline" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink">Two-factor authentication</h3>
          <p className="text-xs text-ink-subtle">A one-time code from an authenticator app on every login.</p>
        </div>
        <div className="flex items-center gap-2">
          {mfaEnabled && mfaMode === 'idle' && (
            <Button variant="secondary" size="xs" onClick={() => enterMode('regenerating')}>
              Regenerate codes
            </Button>
          )}
          <Toggle
            pressed={mfaEnabled}
            onPressedChange={(next) => {
              if (next && !mfaEnabled) void startEnroll()
              else if (!next && mfaEnabled) enterMode('disabling')
            }}
            unpressedLabel="Disabled"
            pressedLabel="Enabled"
            aria-label="Two-factor authentication"
          />
        </div>
      </div>

      {mfaMode === 'enrolling' && setupData && (
        <div className="mt-4 rounded-lg bg-surface-2 p-4">
          <div className="flex flex-wrap gap-6">
            <img
              src={setupData.qr}
              alt="QR code for your authenticator app"
              className="h-36 w-36 rounded-md bg-white p-2"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Scan with your authenticator app</p>
              <p id="mfa-enroll-label" className="mt-1 text-xs text-ink-subtle">
                Then enter the 6-digit code it shows to finish enabling.
              </p>
              <div className="mt-3">
                <OtpInput value={mfaCode} onChange={setMfaCode} length={6} aria-labelledby="mfa-enroll-label" />
              </div>
              <div className="mt-3 flex justify-center gap-2">
                <Button size="sm" onClick={() => void submitMfaCode()} loading={mfaBusy} disabled={mfaCode.length !== 6}>
                  Enable
                </Button>
                <Button size="sm" variant="ghost" onClick={() => enterMode('idle')}>Cancel</Button>
              </div>
            </div>
          </div>
          <p className="mt-4 mb-2 text-xs text-ink-subtle">
            Backup codes — store these safely, they are shown only once.
          </p>
          <div className="grid grid-cols-2 gap-1 font-mono text-xs text-ink sm:grid-cols-4">
            {setupData.backupCodes.map((code) => (
              <span key={code}>{code}</span>
            ))}
          </div>
        </div>
      )}

      {(mfaMode === 'disabling' || mfaMode === 'regenerating') && (
        <div className="mt-4 rounded-lg bg-surface-2 p-4">
          <p id="mfa-code-label" className="text-sm font-medium text-ink">
            {mfaMode === 'disabling'
              ? 'Enter a code from your authenticator app to disable two-factor authentication'
              : 'Enter a code from your authenticator app to generate new backup codes'}
          </p>
          <div className="mt-3">
            <OtpInput value={mfaCode} onChange={setMfaCode} length={6} aria-labelledby="mfa-code-label" />
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <Button
              size="sm"
              variant={mfaMode === 'disabling' ? 'danger' : 'primary'}
              onClick={() => void submitMfaCode()}
              loading={mfaBusy}
              disabled={mfaCode.length !== 6}
            >
              {mfaMode === 'disabling' ? 'Disable' : 'Generate codes'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => enterMode('idle')}>Cancel</Button>
          </div>
        </div>
      )}

      {freshCodes && (
        <div className="mt-4 rounded-lg bg-surface-2 p-4">
          <p className="mb-2 text-xs text-ink-subtle">
            Store these backup codes safely — they are shown only once.
          </p>
          <div className="grid grid-cols-2 gap-1 font-mono text-xs text-ink sm:grid-cols-4">
            {freshCodes.map((code) => (
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
