import { Clock } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFonderieClient } from '@fonderie/react'
import { Button } from './Button'
import { Card } from './Card'
import { SectionHeader } from './SectionHeader'
import { Select } from './Select'
import { useAppSession } from '../lib/session'
import {
  DATE_FORMATS,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  TIME_FORMATS,
  formatDate,
  formatTime,
} from '../lib/dateFormat'

const labelClass = 'mb-1 block text-sm font-medium text-ink'

export function DateTimeFormatCard() {
  const { user, refresh } = useAppSession()
  const client = useFonderieClient()

  // Local draft so the preview updates live before saving; seeded from the
  // saved preferences (falling back to the app defaults).
  const [dateFormat, setDateFormat] = useState(user?.preferences.dateFormat ?? DEFAULT_DATE_FORMAT)
  const [timeFormat, setTimeFormat] = useState(user?.preferences.timeFormat ?? DEFAULT_TIME_FORMAT)
  const [saving, setSaving] = useState(false)

  const saved = user?.preferences
  const dirty = dateFormat !== (saved?.dateFormat ?? DEFAULT_DATE_FORMAT) || timeFormat !== (saved?.timeFormat ?? DEFAULT_TIME_FORMAT)

  const now = new Date()

  const handleSave = async () => {
    setSaving(true)
    try {
      await client.auth.updatePreferences({ dateFormat, timeFormat })
      await refresh({ force: true })
      toast.success('Date & time format updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update format')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card as="section" id="datetime" className="scroll-mt-20 p-5">
      <SectionHeader
        icon={Clock}
        title="Date & Time Format"
        description="Customize how dates and times are displayed across the app."
      />

      <div className="mt-4 grid gap-x-6 gap-y-4 lg:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="dateFormat">Date format</label>
          <Select
            inputId="dateFormat"
            options={DATE_FORMATS}
            value={DATE_FORMATS.find((o) => o.value === dateFormat)}
            onChange={(o) => o && setDateFormat(o.value)}
          />
          <p className="mt-1 text-xs text-ink-subtle">Choose your preferred date format.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="timeFormat">Time format</label>
          <Select
            inputId="timeFormat"
            options={TIME_FORMATS}
            value={TIME_FORMATS.find((o) => o.value === timeFormat)}
            onChange={(o) => o && setTimeFormat(o.value)}
          />
          <p className="mt-1 text-xs text-ink-subtle">Choose between 12-hour and 24-hour time.</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface-2 p-4">
        <h3 className="mb-2 text-sm font-medium text-ink">Preview</h3>
        <div className="space-y-1 text-sm text-ink-muted">
          <div>Date: {formatDate(now, dateFormat)}</div>
          <div>Time: {formatTime(now, timeFormat)}</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={() => void handleSave()} loading={saving} disabled={!dirty}>
          Save format
        </Button>
      </div>
    </Card>
  )
}
