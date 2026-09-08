import { useState } from 'react'
import { Laptop, DeviceMobile, Devices, SignOut } from '@phosphor-icons/react'
import { useSessions } from '@fonderie/react-auth'
import type { ISessionDTO } from '@fonderie/react-auth'
import { toast } from 'sonner'
import { Button } from './Button'
import { Card } from './Card'
import { ConfirmDialog } from './ConfirmDialog'
import { SectionHeader } from './SectionHeader'
import { parseUserAgent } from '../lib/userAgent'

// "Signed in Sep 7, 2026" — honest until Phase 5 adds last_active_at; we only
// know when the session was created, not last used, so we say so plainly.
function signedInLabel(iso: string) {
  return `Signed in ${new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function SessionRow({
  session,
  onTerminate,
}: {
  session: ISessionDTO
  onTerminate: (id: string) => void
}) {
  const ua = parseUserAgent(session.userAgent)
  const Icon = ua.device === 'phone' ? DeviceMobile : Laptop
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-hairline p-4">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">{ua.os}</span>
            {session.current && (
              <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary">
                Current
              </span>
            )}
          </div>
          <div className="space-y-0.5 text-sm text-ink-subtle">
            <div>{ua.summary}</div>
            <div>{session.ipAddress ?? 'Unknown IP'}</div>
            <div>{signedInLabel(session.createdAt)}</div>
          </div>
        </div>
      </div>
      {!session.current && (
        <Button variant="secondary" size="sm" onClick={() => onTerminate(session.id)}>
          <SignOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Terminate
        </Button>
      )}
    </div>
  )
}

export function ActiveSessionsCard() {
  const { sessions, isLoading, error, terminate, terminateOthers } = useSessions()
  // null = closed; 'others' = the bulk confirm; a string id = terminate that one.
  const [confirming, setConfirming] = useState<string | 'others' | null>(null)
  const [busy, setBusy] = useState(false)

  const others = sessions.filter((s) => !s.current)

  const runTerminate = async () => {
    if (confirming === null) return
    setBusy(true)
    try {
      if (confirming === 'others') {
        await terminateOthers()
        toast.success('Other sessions terminated')
      } else {
        await terminate(confirming)
        toast.success('Session terminated')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not terminate session')
    } finally {
      setBusy(false)
      setConfirming(null)
    }
  }

  return (
    <Card as="section" id="sessions" className="scroll-mt-20 p-5">
      <SectionHeader
        icon={Devices}
        title="Active Sessions"
        description="Devices currently signed in to your account."
        action={
          others.length > 0 ? (
            <Button variant="secondary" size="sm" onClick={() => setConfirming('others')}>
              <SignOut className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Terminate all others
            </Button>
          ) : undefined
        }
      />

      {error ? (
        <p className="mt-4 text-sm text-error">Couldn't load sessions. {error.message}</p>
      ) : isLoading ? (
        <p className="mt-4 text-sm text-ink-subtle">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="mt-4 text-sm text-ink-subtle">No active sessions.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sessions.map((s) => (
            <SessionRow key={s.id} session={s} onTerminate={(id) => setConfirming(id)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={confirming === 'others' ? 'Terminate all other sessions?' : 'Terminate this session?'}
        description={
          confirming === 'others'
            ? 'Every session except this one will be signed out immediately.'
            : 'This device will be signed out immediately.'
        }
        confirmLabel={busy ? 'Terminating…' : 'Terminate'}
        danger
        onConfirm={() => void runTerminate()}
        onClose={() => !busy && setConfirming(null)}
      />
    </Card>
  )
}
