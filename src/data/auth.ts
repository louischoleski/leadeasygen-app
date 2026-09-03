import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'

export interface AuthUser {
  name: string
  email: string
}

const STORAGE_KEY = 'auth'

function readStored(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const p = parsed as Partial<AuthUser>
    if (typeof p.name !== 'string' || typeof p.email !== 'string') return null
    return { name: p.name, email: p.email }
  } catch {
    return null
  }
}

// Module-level store (same pattern as billing/jobs); null = logged out
let user: AuthUser | null = readStored()
const store = createSubscribable()

// The demo trusts the form input; Fonderie's session endpoints replace these
export function login(next: AuthUser) {
  user = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // storage unavailable: session lasts until reload
  }
  store.emit()
}

export function logout() {
  user = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing stored
  }
  store.emit()
}

export function useAuth() {
  const current = useSyncExternalStore(store.subscribe, () => user)
  return { user: current, login, logout }
}
