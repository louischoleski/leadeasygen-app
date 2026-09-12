import { FonderieApiError } from '@fonderie/react-auth'
import { tNow } from '../hooks/useTranslation'

// What a failed action may toast. Server explanations (FonderieApiError) are
// written for users and pass through; every other error message is an
// implementation detail ("TypeError: Failed to fetch") that must not reach
// the screen — browser-level fetch failures read as a connectivity problem,
// the rest get the caller's contextual fallback or the generic copy.
export function userErrorMessage(err: unknown, fallback?: string): string {
  if (err instanceof FonderieApiError) {
    return err.explanation || fallback || tNow('common.errors.unknown')
  }
  if (err instanceof TypeError) return tNow('common.errors.network')
  return fallback ?? tNow('common.errors.unknown')
}
