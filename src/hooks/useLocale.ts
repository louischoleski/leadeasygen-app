import { useSyncExternalStore } from 'react'

export const locales = ['en', 'fr', 'es'] as const
export type Locale = (typeof locales)[number]

const STORAGE_KEY = 'locale'

function readStoredLocale(): Locale {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY)
    if (item === null) return 'en'
    const parsed: unknown = JSON.parse(item)
    return (locales as readonly unknown[]).includes(parsed) ? (parsed as Locale) : 'en'
  } catch {
    return 'en'
  }
}

// Module-level store (not useLocalStorage) because the navbar dropdown and the
// drawer pills render simultaneously and must observe the same value.
let locale: Locale = readStoredLocale()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useLocale() {
  const current = useSyncExternalStore(subscribe, () => locale)
  return {
    locale: current,
    setLocale: (next: Locale) => {
      locale = next
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // storage unavailable: keep the in-memory value for this session
      }
      listeners.forEach((listener) => listener())
    },
  }
}
