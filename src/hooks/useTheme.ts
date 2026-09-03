import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// The pre-paint script in index.html resolves the initial theme
// (localStorage, then prefers-color-scheme, then dark); read its result.
// Module-level store so every consumer (Navbar toggle, Toaster) stays in sync.
let theme: Theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'
const listeners = new Set<() => void>()

function applyTheme(next: Theme) {
  theme = next
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
  root.classList.toggle('light', next === 'light')
  localStorage.setItem('theme', next)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useTheme() {
  const current = useSyncExternalStore(subscribe, () => theme)
  return {
    theme: current,
    toggleTheme: () => applyTheme(current === 'dark' ? 'light' : 'dark'),
  }
}
