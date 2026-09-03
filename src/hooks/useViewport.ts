import { useSyncExternalStore } from 'react'

// Single source of truth for breakpoint logic (Tailwind md 768px, lg 1024px).
// matchMedia change events fire only on threshold crossings, so consumers
// re-render when a tier changes — not on every resize pixel.
const mdQuery = window.matchMedia('(min-width: 768px)')
const lgQuery = window.matchMedia('(min-width: 1024px)')

function subscribe(listener: () => void) {
  mdQuery.addEventListener('change', listener)
  lgQuery.addEventListener('change', listener)
  return () => {
    mdQuery.removeEventListener('change', listener)
    lgQuery.removeEventListener('change', listener)
  }
}

export function useViewport() {
  const isMd = useSyncExternalStore(subscribe, () => mdQuery.matches)
  const isLg = useSyncExternalStore(subscribe, () => lgQuery.matches)
  return {
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  }
}
