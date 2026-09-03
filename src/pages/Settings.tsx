import { GearSix, ShieldCheck } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import profile from '../assets/profile.jpg'
import ViewHeader from '../components/ViewHeader'
import { localeNames, locales, useLocale, type Locale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'

const tabs = ['profile', 'security'] as const
type Tab = (typeof tabs)[number]

const timezones = ['UTC', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo']

const newBackupCodes = () =>
  Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 10))

function ProfileTab() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="card max-w-[800px] p-6">
      <div className="mb-6 flex items-center gap-4">
        <img src={profile} alt="" className="h-16 w-16 rounded-full" />
        <button
          type="button"
          className="btn btn-secondary"
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
        <div className="grid gap-x-8 lg:grid-cols-2">
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="name">Full name</label>
            <input type="text" defaultValue="Luna Admin" name="name" id="name" className="input" />
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="email">Email address</label>
            <input type="email" defaultValue="luna@company.io" name="email" id="email" className="input" />
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="phone">Phone</label>
            <input type="tel" defaultValue="" name="phone" id="phone" className="input" />
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="timezone">Timezone</label>
            <select name="timezone" id="timezone" defaultValue="Europe/Paris" className="input">
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="language">Language</label>
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
        <button type="submit" className="btn btn-primary">Save changes</button>
      </form>
    </div>
  )
}

function SecurityTab() {
  const [mfaEnabled, setMfaEnabled] = useLocalStorage('mfaEnabled', false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [deleteArmed, setDeleteArmed] = useState(false)

  const enableMfa = () => {
    setMfaEnabled(true)
    setBackupCodes(newBackupCodes())
    toast.success('Two-factor authentication enabled')
  }

  return (
    <div className="max-w-[800px]">
      <div className="card mb-5 p-6">
        <h3 className="mb-4 font-medium text-ink">Change password</h3>
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
          <div className="grid gap-x-8 lg:grid-cols-3">
            <div className="mb-4">
              <label className="mb-1 block font-medium text-ink" htmlFor="currentPassword">Current password</label>
              <input type="password" required name="currentPassword" id="currentPassword" className="input" />
            </div>
            <div className="mb-4">
              <label className="mb-1 block font-medium text-ink" htmlFor="newPassword">New password</label>
              <input type="password" required name="newPassword" id="newPassword" className="input" />
            </div>
            <div className="mb-4">
              <label className="mb-1 block font-medium text-ink" htmlFor="repeatPassword">Repeat new password</label>
              <input type="password" required name="repeatPassword" id="repeatPassword" className="input" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Update password</button>
        </form>
      </div>

      <div className="card mb-5 p-6">
        <h3 className="mb-1 font-medium text-ink">
          <ShieldCheck size={16} aria-hidden="true" className="inline text-ink-subtle" /> Two-factor
          authentication
        </h3>
        <p className="mb-4 text-xs text-ink-subtle">
          Adds a one-time code from an authenticator app to every login.
        </p>
        {mfaEnabled ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink">Enabled</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setBackupCodes(newBackupCodes())
                toast.success('New backup codes generated')
              }}
            >
              Regenerate backup codes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setMfaEnabled(false)
                setBackupCodes(null)
                toast('Two-factor authentication disabled')
              }}
            >
              Disable
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary" onClick={enableMfa}>
            Enable 2FA
          </button>
        )}
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
      </div>

      <div className="card border-error/40 p-6">
        <h3 className="mb-1 font-medium text-error">Danger zone</h3>
        <p className="mb-4 text-xs text-ink-subtle">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
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
    </div>
  )
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div>
      <ViewHeader icon={GearSix} title="Settings">
        Manage your account profile and security.
      </ViewHeader>
      <div className="mb-5 flex gap-1" role="tablist" aria-label="Settings sections">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tab === t ? 'bg-surface-2 text-ink' : 'text-ink-subtle hover:text-ink'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'profile' ? <ProfileTab /> : <SecurityTab />}
    </div>
  )
}
