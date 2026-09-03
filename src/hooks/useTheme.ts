import { useSyncExternalStore } from 'react'
import { createSubscribable } from './subscribable'

export type Theme = 'light' | 'dark'

// The pre-paint script in index.html resolves the initial theme
// (localStorage, then prefers-color-scheme, then dark); read its result.
// Module-level store (not useLocalStorage) because the navbar toggle, the
// drawer toggle, and the toaster render simultaneously and must observe the
// same value. Persisting only on explicit toggle keeps first visits following
// the OS preference live instead of freezing a snapshot of it.
let theme: Theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'
const store = createSubscribable()

function applyTheme(next: Theme) {
  theme = next
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
  root.classList.toggle('light', next === 'light')
  try {
    window.localStorage.setItem('theme', JSON.stringify(next))
  } catch {
    // storage unavailable: keep the in-memory value for this session
  }
  store.emit()
}

export function useTheme() {
  const current = useSyncExternalStore(store.subscribe, () => theme)
  return {
    theme: current,
    toggleTheme: () => applyTheme(current === 'dark' ? 'light' : 'dark'),
  }
}
