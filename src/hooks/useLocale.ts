import { useSyncExternalStore } from 'react'

export const locales = ['en', 'fr', 'es'] as const
export type Locale = (typeof locales)[number]

// Module-level store so the desktop navbar dropdown and the mobile drawer
// selector stay in sync without prop drilling.
let locale: Locale = 'en'
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
      listeners.forEach((listener) => listener())
    },
  }
}
