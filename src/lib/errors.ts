import { FonderieApiError } from '@fonderie/react-auth'
import { tNow } from '../hooks/useTranslation'

// What a failed action may toast. Server explanations (FonderieApiError) are
// written for users and pass through; every other error message is an
// implementation detail ("TypeError: Failed to fetch") that must not reach
// the screen — browser-level fetch failures read as a connectivity problem,
// the rest get the caller's contextual fallback or the generic copy.
//
// Caveat: the react hooks wrap ANY client-side throw as
// FonderieApiError('unknown', String(err), 0) — status 0 means no HTTP
// response ever arrived, so that explanation is String(err) debris, not a
// server message, and gets the same treatment as a bare error.
export function userErrorMessage(err: unknown, fallback?: string): string {
  if (err instanceof FonderieApiError && err.status !== 0) {
    return err.explanation || fallback || tNow('common.errors.unknown')
  }
  const text = err instanceof FonderieApiError ? err.explanation : err instanceof Error ? String(err) : ''
  if (/TypeError|NetworkError|Load failed/i.test(text)) return tNow('common.errors.network')
  return fallback ?? tNow('common.errors.unknown')
}
