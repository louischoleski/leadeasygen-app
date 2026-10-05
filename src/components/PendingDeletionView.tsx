import type { IPendingDeletion } from '@fonderie/client'
import { FonderieApiError, useRestoreAccount } from '@fonderie/react-auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '../hooks/useTranslation'
import { formatLongDate } from '../lib/dateFormat'
import { localizedErrorMessage } from '../lib/errors'
import AuthCard from './AuthCard'
import { Button } from './Button'
import { isSecondFactorReady } from '../lib/secondFactor'
import { SecondFactorField } from './SecondFactorField'

interface PendingDeletionViewProps {
  pending: IPendingDeletion
  /** Restored and signed in: the access token is already stored — finish exactly like a sign-in. */
  onRestored: () => Promise<void>
  /** Leave the account to its deletion and go back to signing in (signed out). */
  onBack: () => void
}

/**
 * What a sign-in to a closed account shows: when it will be deleted, and the
 * choice to keep it. The refusal carried a short-lived restore token; "Keep my
 * account" spends it (plus a second factor when two-factor is on) and signs
 * in like a login.
 */
export function PendingDeletionView({ pending, onRestored, onBack }: PendingDeletionViewProps) {
  const { t } = useTranslation()
  const { restore, isLoading } = useRestoreAccount()
  const [mfaRequired, setMfaRequired] = useState(pending.mfaRequired)
  const [mfaCode, setMfaCode] = useState('')
  const [backup, setBackup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // The restore token lasts minutes; once refused, only a new sign-in mints one.
  const [expired, setExpired] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const deleteOn = formatLongDate(pending.deleteOn)
  const ready = !mfaRequired || isSecondFactorReady(mfaCode, backup)

  const keep = async () => {
    if (!ready || isLoading || finishing) return
    setError(null)
    try {
      await restore({
        restoreToken: pending.restoreToken,
        ...(mfaRequired ? { mfaCode: mfaCode.trim() } : {}),
      })
    } catch (err) {
      if (err instanceof FonderieApiError && err.reason === 'RESTORE_TOKEN_INVALID') {
        setExpired(true)
      } else if (err instanceof FonderieApiError && err.reason === 'MFA_REQUIRED') {
        setMfaRequired(true)
        setMfaCode('')
      }
      setError(localizedErrorMessage(err, t('auth.pendingDeletion.failed')))
      return
    }
    setFinishing(true)
    toast.success(t('auth.pendingDeletion.restored'))
    try {
      await onRestored()
    } catch (err) {
      setError(localizedErrorMessage(err))
    } finally {
      setFinishing(false)
    }
  }

  return (
    <AuthCard
      title={t('auth.pendingDeletion.title')}
      subtitle={t('auth.pendingDeletion.body', { date: deleteOn })}
    >
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void keep()
        }}
      >
        {pending.requestedAt && (
          <p className="text-sm text-ink-subtle">
            {t('auth.pendingDeletion.requested', { date: formatLongDate(pending.requestedAt) })}
          </p>
        )}
        {mfaRequired && !expired && (
          <div className="space-y-3">
            <p className="text-sm text-ink-subtle">{t('auth.pendingDeletion.mfa')}</p>
            <SecondFactorField
              value={mfaCode}
              onChange={setMfaCode}
              backup={backup}
              onBackupChange={setBackup}
              disabled={isLoading || finishing}
            />
          </div>
        )}
        {error && (
          <p role="alert" className="rounded-lg border border-error/40 bg-error/5 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}
        <div className="space-y-2">
          {expired ? (
            <Button type="button" fullWidth onClick={onBack}>
              {t('auth.pendingDeletion.signInAgain')}
            </Button>
          ) : (
            <>
              <Button type="submit" fullWidth loading={isLoading || finishing} disabled={!ready}>
                {t('auth.pendingDeletion.keep')}
              </Button>
              <Button type="button" variant="ghost" fullWidth disabled={isLoading || finishing} onClick={onBack}>
                {t('auth.pendingDeletion.continue')}
              </Button>
            </>
          )}
        </div>
        {!expired && (
          <p className="text-center text-xs text-ink-subtle">
            {t('auth.pendingDeletion.continueHint', { date: deleteOn })}
          </p>
        )}
      </form>
    </AuthCard>
  )
}
