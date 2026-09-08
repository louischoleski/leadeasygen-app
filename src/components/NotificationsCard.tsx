import { BellRinging, ChatText, DeviceMobile, Envelope } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFonderieClient } from '@fonderie/react'
import { Button } from './Button'
import { Card } from './Card'
import { SectionHeader } from './SectionHeader'
import { Toggle } from './Toggle'
import { useAppSession } from '../lib/session'

type ChannelKey = 'email' | 'inApp' | 'sms' | 'push'

interface ChannelRow {
  key: ChannelKey
  icon: Icon
  label: string
  description: string
}

// The four channels @fonderie/auth models on user preferences. LeadEasyGen
// only delivers over email today (SMS/push have no provider wired), so those
// rows note the requirement — the preference still saves, and starts sending
// once a provider is configured.
const CHANNELS: ChannelRow[] = [
  {
    key: 'email',
    icon: Envelope,
    label: 'Email notifications',
    description: 'Low-credit warnings, purchase receipts, security alerts, and account updates by email.',
  },
  {
    key: 'inApp',
    icon: ChatText,
    label: 'In-app notifications',
    description: 'Show notifications inside the app.',
  },
  {
    key: 'sms',
    icon: DeviceMobile,
    label: 'SMS notifications',
    description: 'Critical alerts by text message. Requires a verified phone number.',
  },
  {
    key: 'push',
    icon: BellRinging,
    label: 'Push notifications',
    description: 'Instant alerts on your device. Requires a registered device.',
  },
]

const DEFAULTS: Record<ChannelKey, boolean> = { email: true, inApp: true, sms: false, push: false }

export function NotificationsCard() {
  const { user, refresh } = useAppSession()
  const client = useFonderieClient()

  const saved = user?.preferences.notifications
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>({
    email: saved?.email ?? DEFAULTS.email,
    inApp: saved?.inApp ?? DEFAULTS.inApp,
    sms: saved?.sms ?? DEFAULTS.sms,
    push: saved?.push ?? DEFAULTS.push,
  })
  const [saving, setSaving] = useState(false)

  const dirty = CHANNELS.some((c) => channels[c.key] !== (saved?.[c.key] ?? DEFAULTS[c.key]))

  const set = (key: ChannelKey, value: boolean) => setChannels((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      // updatePreferences REPLACES the notifications object, so send all four.
      await client.auth.updatePreferences({ notifications: channels })
      await refresh({ force: true })
      toast.success('Notification preferences updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update notifications')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" id="notifications" className="scroll-mt-20 p-5">
      <SectionHeader
        icon={BellRinging}
        title="Notifications"
        description="Choose which channels we use to reach you."
      />

      <div className="mt-4 divide-y divide-hairline">
        {CHANNELS.map(({ key, icon: RowIcon, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <RowIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink-subtle" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-sm text-ink-subtle">{description}</p>
              </div>
            </div>
            <Toggle
              pressed={channels[key]}
              onPressedChange={(next) => set(key, next)}
              pressedLabel="On"
              unpressedLabel="Off"
              aria-label={label}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
          Save preferences
        </Button>
      </div>
    </Card>
  )
}
