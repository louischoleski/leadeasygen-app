import { FonderieApiError, useAccountData } from '@fonderie/react-auth'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '../hooks/useTranslation'
import { localizedErrorMessage } from '../lib/errors'
import { Button } from './Button'
import { Card } from './Card'
import { DialogShell } from './DialogShell'
import { OtpInput } from './OtpInput'
import { isSecondFactorReady } from '../lib/secondFactor'
import { SecondFactorField } from './SecondFactorField'

// The server's resend cooldown for a deletion code; a 429 carries the exact
// remainder (details.retryAfter, seconds), which wins over this guess.
const RESEND_COOLDOWN_SECONDS = 60

// Render it only while open: every opening starts over, so a code from an
// abandoned attempt is never assumed to still be in the inbox.
interface DeleteAccountDialogProps {
  email: string
  onClose: () => void
  /** The account is closed: every session has ended, the local token is gone. */
  onClosed: (deleteOn: string) => void
}

function retryAfterOf(err: unknown): number | null {
  if (!(err instanceof FonderieApiError) || err.reason !== 'VERIFICATION_COOLDOWN') return null
  const d = err.details as { retryAfter?: unknown } | undefined
  return typeof d?.retryAfter === 'number' && d.retryAfter > 0 ? d.retryAfter : RESEND_COOLDOWN_SECONDS
}

/**
 * Deleting an account with proof: explain what happens → email a code to the
 * account address → the code (plus a second factor when two-factor is on)
 * closes the account. It is permanently deleted on the date the server
 * returns, unless its owner signs in before then and keeps it.
 */
export function DeleteAccountDialog({ email, onClose, onClosed }: DeleteAccountDialogProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const codeLabelId = useId()
  const formId = useId()
  const { requestDeletion, confirmDeletion } = useAccountData()

  const [step, setStep] = useState<'explain' | 'code'>('explain')
  const [sending, setSending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [backup, setBackup] = useState(false)
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const cooldownLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000))
  useEffect(() => {
    if (cooldownUntil <= Date.now()) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [cooldownUntil])

  const startCooldown = (seconds: number) => {
    const start = Date.now()
    setNow(start)
    setCooldownUntil(start + seconds * 1000)
  }

  const sendCode = async (resend: boolean) => {
    setSending(true)
    setError(null)
    try {
      const result = await requestDeletion({ channel: 'email' })
      setMfaRequired(result.mfaRequired)
      setExpiresInMinutes(Math.max(1, Math.round(result.expiresInSeconds / 60)))
      setCode('')
      setStep('code')
      startCooldown(RESEND_COOLDOWN_SECONDS)
      if (resend) toast.success(t('settings.danger.resent'))
    } catch (err) {
      const retryAfter = retryAfterOf(err)
      if (retryAfter !== null) {
        // A code went out moments ago: it is still good, so let it be entered.
        startCooldown(retryAfter)
        setStep('code')
      }
      setError(localizedErrorMessage(err, t('settings.danger.sendFailed')))
    } finally {
      setSending(false)
    }
  }

  const codeReady = /^\d{6}$/.test(code)
  const secondFactorReady = !mfaRequired || isSecondFactorReady(mfaCode, backup)

  const confirm = async () => {
    if (!codeReady || !secondFactorReady || confirming) return
    setConfirming(true)
    setError(null)
    try {
      const result = await confirmDeletion({
        code,
        ...(mfaRequired ? { mfaCode: mfaCode.trim() } : {}),
      })
      onClosed(result.deleteOn)
    } catch (err) {
      if (err instanceof FonderieApiError && err.reason === 'MFA_REQUIRED') {
        // Two-factor turned out to be on (or the second factor was wrong).
        setMfaRequired(true)
        setMfaCode('')
      } else if (err instanceof FonderieApiError && err.reason === 'VERIFICATION_FAILED') {
        setCode('')
      }
      setError(localizedErrorMessage(err, t('settings.danger.deleteFailed')))
    } finally {
      setConfirming(false)
    }
  }

  const busy = sending || confirming

  return (
    <DialogShell open labelledBy={titleId} onClose={busy ? () => undefined : onClose} wide>
      <Card className="p-6">
        <h2 id={titleId} className="text-card-title text-ink">
          {t('settings.danger.confirmTitle')}
        </h2>

        {step === 'explain' ? (
          <div className="mt-3 space-y-3 text-sm text-ink-subtle">
            <p>{t('settings.danger.explain.closesNow')}</p>
            <p className="font-medium text-ink">{t('settings.danger.explain.deletedLater')}</p>
            <p>{t('settings.danger.explain.keep')}</p>
            <p>{t('settings.danger.explain.sendCode', { email })}</p>
          </div>
        ) : (
          <form
            id={formId}
            noValidate
            className="mt-3 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              void confirm()
            }}
          >
            <p className="text-sm text-ink-subtle">
              {expiresInMinutes
                ? t('settings.danger.codeSent', { email, minutes: expiresInMinutes })
                : t('settings.danger.codeSentShort', { email })}
            </p>
            <div>
              <p id={codeLabelId} className="mb-3 text-sm font-medium text-ink">
                {t('settings.danger.codeLabel')}
              </p>
              <OtpInput
                value={code}
                onChange={setCode}
                length={6}
                disabled={confirming}
                aria-labelledby={codeLabelId}
              />
            </div>
            {mfaRequired && (
              <div className="space-y-3">
                <p className="text-sm text-ink-subtle">{t('settings.danger.mfaHint')}</p>
                <SecondFactorField
                  value={mfaCode}
                  onChange={setMfaCode}
                  backup={backup}
                  onBackupChange={setBackup}
                  disabled={confirming}
                />
              </div>
            )}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                disabled={busy || cooldownLeft > 0}
                onClick={() => void sendCode(true)}
              >
                {cooldownLeft > 0
                  ? t('settings.danger.resendIn', { seconds: cooldownLeft })
                  : t('settings.danger.resend')}
              </Button>
            </div>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-error/40 bg-error/5 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={busy} autoFocus>
            {t('common.dialog.goBack')}
          </Button>
          {step === 'explain' ? (
            <Button variant="danger" loading={sending} onClick={() => void sendCode(false)}>
              {t('settings.danger.sendCode')}
            </Button>
          ) : (
            <Button
              type="submit"
              form={formId}
              variant="danger"
              loading={confirming}
              disabled={!codeReady || !secondFactorReady || sending}
            >
              {t('settings.danger.confirm')}
            </Button>
          )}
        </div>
      </Card>
    </DialogShell>
  )
}
