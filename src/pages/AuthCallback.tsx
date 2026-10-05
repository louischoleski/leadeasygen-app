import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { pendingDeletionOf, type IPendingDeletion } from '@fonderie/client'
import { FonderieApiError, persistToken } from '@fonderie/react-auth'
import AuthCard from '../components/AuthCard'
import { PendingDeletionView } from '../components/PendingDeletionView'
import { API_BASE_URL, fonderie } from '../lib/fonderie'
import { useTranslation } from '../hooks/useTranslation'
import { useAppSession } from '../lib/session'

/**
 * Where Google sends the browser back, by way of our API.
 *
 * The API's callback never hands tokens to the browser directly — it parks
 * them under a single-use code and redirects here with ?code=. This page
 * trades that code for the tokens over its own POST, so nothing sensitive
 * lands in the URL bar, browser history, or a referrer header.
 */
export default function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const session = useAppSession()
  const [failed, setFailed] = useState(false)
  // Google proved the address, but the account is closed and waiting for its
  // deletion date: offer to keep it rather than calling the sign-in failed.
  const [pendingDeletion, setPendingDeletion] = useState<IPendingDeletion | null>(null)
  // The code is single-use: React 18 StrictMode double-invokes effects in dev,
  // and the second exchange would legitimately fail. Guard so the first wins.
  const claimed = useRef(false)

  useEffect(() => {
    const code = params.get('code')
    const error = params.get('error')
    if (error || !code) {
      setFailed(true)
      return
    }
    if (claimed.current) return
    claimed.current = true

    void (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/google/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code }),
        })
        const body = (await res.json().catch(() => ({}))) as {
          reason?: string
          explanation?: string
          details?: unknown
          result?: { tokens?: { access?: string } }
        }
        if (!res.ok) {
          // The handoff can carry the sign-in's refusal instead of tokens;
          // the one with a way forward is a closed account to keep.
          const pending = pendingDeletionOf(
            new FonderieApiError(body.reason ?? 'unknown', body.explanation ?? '', res.status, body.details),
          )
          if (pending) {
            setPendingDeletion(pending)
            return
          }
          throw new Error(String(res.status))
        }
        const access = body.result?.tokens?.access
        if (!access) throw new Error('no token')

        persistToken(access)
        fonderie.auth.setAccessToken(access)
        await session.refresh({ force: true })
        navigate('/', { replace: true })
      } catch {
        // Never show the raw failure: it is not actionable by a user, and on
        // an auth screen an unexplained error string costs trust.
        setFailed(true)
      }
    })()
  }, [params, navigate, session])

  if (pendingDeletion) {
    return (
      <PendingDeletionView
        pending={pendingDeletion}
        onRestored={async () => {
          await session.refresh({ force: true })
          navigate('/', { replace: true })
        }}
        onBack={() => navigate('/login', { replace: true })}
      />
    )
  }

  return (
    <AuthCard title={failed ? t('auth.callback.failedTitle') : t('auth.callback.title')}>
      <p className="text-sm text-slate-600">
        {failed ? t('auth.callback.failed') : t('auth.callback.working')}
      </p>
      {failed && (
        <button
          type="button"
          className="mt-4 text-sm font-medium text-emerald-700 underline"
          onClick={() => navigate('/login', { replace: true })}
        >
          {t('auth.callback.backToLogin')}
        </button>
      )}
    </AuthCard>
  )
}
