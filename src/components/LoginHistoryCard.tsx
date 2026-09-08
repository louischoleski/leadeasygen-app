import { CheckCircle, Download, WarningCircle } from '@phosphor-icons/react'
import { useLoginHistory } from '@fonderie/react-auth'
import type { ILoginEventDTO } from '@fonderie/react-auth'
import { toast } from 'sonner'
import { Button } from './Button'
import { Card } from './Card'
import { parseUserAgent } from '../lib/userAgent'

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
  const { events, isLoading, error, hasMore, loadMore, isLoadingMore } = useLoginHistory({ limit: 20 })

  return (
    <Card as="section" id="activity" className="scroll-mt-20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-card-title text-ink">Login History</h2>
          <p className="mt-1 text-sm text-ink-subtle">Review recent login attempts to your account.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportCsv(events)}
          disabled={events.length === 0}
        >
          <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Export history
        </Button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-error">Couldn't load login history. {error.message}</p>
      ) : isLoading ? (
        <p className="mt-4 text-sm text-ink-subtle">Loading…</p>
      ) : events.length === 0 ? (
        <p className="mt-4 text-sm text-ink-subtle">No login attempts recorded yet.</p>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-md border border-hairline">
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
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
                  {events.map((e) => {
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
              </table>
            </div>
          </div>
          {hasMore && (
            <div className="mt-3 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => void loadMore()} loading={isLoadingMore}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
