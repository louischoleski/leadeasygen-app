import { useSyncExternalStore } from 'react'

// Single source of truth for the md breakpoint (Tailwind's 768px).
const mql = window.matchMedia('(min-width: 768px)')

function subscribe(listener: () => void) {
  mql.addEventListener('change', listener)
  return () => mql.removeEventListener('change', listener)
}

export function useViewport() {
  const isDesktop = useSyncExternalStore(subscribe, () => mql.matches)
  return { isDesktop, isMobile: !isDesktop }
}
