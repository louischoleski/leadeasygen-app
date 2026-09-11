import { CheckCircle, ClockCounterClockwise, Download, WarningCircle } from '@phosphor-icons/react'
import { useLoginHistory } from '@fonderie/react-auth'
import type { ILoginEventDTO } from '@fonderie/react-auth'
import { toast } from 'sonner'
import { Button } from './Button'
import { Card } from './Card'
import { Table } from './Table'
import { SectionHeader } from './SectionHeader'
import { parseUserAgent } from '../lib/userAgent'
import { RECENT_LIST_LIMIT } from '../constants/lists'

const methodLabel: Record<string, string> = {
  password: 'Password',
  mfa: '2FA',
  'oauth-google': 'Google',
  phone: 'Phone',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

const csvEscape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

function exportCsv(events: ILoginEventDTO[]) {
  if (events.length === 0) {
    toast.error('No login history to export')
    return
  }
  const header = 'Date,Time,Method,Status,Device,IP Address'
  const rows = events.map((e) => {
    const { date, time } = formatDate(e.createdAt)
    const ua = parseUserAgent(e.userAgent)
    return [date, time, methodLabel[e.method] ?? e.method, e.outcome, ua.summary, e.ipAddress ?? '']
      .map(csvEscape)
      .join(',')
  })
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `login-history-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function LoginHistoryCard() {
  // Fetch a small buffer (export can use the fuller set) but only render the
  // most recent RECENT_LIST_LIMIT until this card gets real pagination.
  const { events, isLoading, error } = useLoginHistory({ limit: 20 })
  const recent = events.slice(0, RECENT_LIST_LIMIT)

  return (
    <Card as="section" id="activity" className="scroll-mt-20 p-5">
      <SectionHeader
        icon={ClockCounterClockwise}
        title="Login History"
        description="Review recent login attempts to your account."
        action={
          <Button variant="secondary" size="sm" onClick={() => exportCsv(events)} disabled={events.length === 0}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Export history
          </Button>
        }
      />

      {error ? (
        <p className="mt-4 text-sm text-error">Couldn't load login history. {error.message}</p>
      ) : isLoading ? (
        <p className="mt-4 text-sm text-ink-subtle">Loading…</p>
      ) : events.length === 0 ? (
        <p className="mt-4 text-sm text-ink-subtle">No login attempts recorded yet.</p>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-md border border-hairline">
            <Table>
                <thead>
                  <tr className="border-b border-hairline bg-surface-2 text-left text-xs font-medium tracking-wider text-ink-subtle uppercase">
                    <th className="h-10 px-4">Date &amp; time</th>
                    <th className="h-10 px-4">Device</th>
                    <th className="h-10 px-4">IP address</th>
                    <th className="h-10 px-4">Method</th>
                    <th className="h-10 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => {
                    const { date, time } = formatDate(e.createdAt)
                    const ua = parseUserAgent(e.userAgent)
                    const ok = e.outcome === 'success'
                    return (
                      <tr key={e.id} className="border-b border-hairline last:border-b-0">
                        <td className="p-4">
                          <div className="font-medium text-ink">{date}</div>
                          <div className="text-xs text-ink-subtle">{time}</div>
                        </td>
                        <td className="p-4 text-ink-muted">{ua.summary}</td>
                        <td className="p-4">
                          <code className="text-xs text-ink-muted">{e.ipAddress ?? '—'}</code>
                        </td>
                        <td className="p-4 text-ink-muted">{methodLabel[e.method] ?? e.method}</td>
                        <td className="p-4">
                          <span
                            className={
                              ok
                                ? 'inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success'
                                : 'inline-flex items-center gap-1.5 rounded-md bg-error/10 px-2 py-0.5 text-xs font-semibold text-error'
                            }
                          >
                            {ok ? (
                              <CheckCircle className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
                            ) : (
                              <WarningCircle className="h-3.5 w-3.5" weight="fill" aria-hidden="true" />
                            )}
                            {ok ? 'Success' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
            </Table>
          </div>
        </>
      )}
    </Card>
  )
}
