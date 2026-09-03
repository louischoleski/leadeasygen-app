import { CaretDown, Globe, List, MagnifyingGlass, Moon, Sun, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.jpg'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { locales, useLocale } from '../hooks/useLocale'
import { useOS } from '../hooks/useOS'
import { useTheme } from '../hooks/useTheme'
import { useViewport } from '../hooks/useViewport'

export default function Navbar({ onToggleNav }: { onToggleNav: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const { isMobile } = useViewport()
  const os = useOS()
  const [localeOpen, setLocaleOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // The overlay is a mobile-only pattern: close it when the viewport leaves mobile
  useEffect(() => {
    if (!isMobile && searchOpen) setSearchOpen(false)
  }, [isMobile, searchOpen])

  // On mobile the shortcut is meaningless (no hardware keyboard assumption) and
  // the overlay would be closed by the guard above, so focus the inline input.
  useKeyboardShortcut(
    'k',
    () => {
      if (!isMobile) searchInputRef.current?.focus()
    },
    { meta: os === 'mac', ctrl: os !== 'mac' },
  )
  useKeyboardShortcut('Escape', () => setSearchOpen(false), { preventDefault: false })

  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-hairline bg-canvas pr-3 pl-1 md:pr-4 md:pl-0">
      {/* Brand slab: desktop luxury only — 140px on tablet, 200px on desktop, gone on mobile */}
      <Link
        to="/"
        className="hidden h-full shrink-0 items-center gap-2 bg-primary transition-colors hover:bg-primary-hover md:flex md:w-[140px] md:px-4 lg:w-[200px] lg:px-5"
      >
        <span className="text-sm font-semibold tracking-[0.2em] text-on-primary uppercase lg:tracking-[0.3em]">
          Luna
        </span>
        {/* black-tint pill: the white-tint fails AA contrast under the wordmark */}
        <span className="hidden rounded-full bg-overlay/25 px-1.5 py-0.5 text-[10px] font-medium text-on-primary lg:inline">
          v1.4
        </span>
      </Link>
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleNav}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-ink-subtle transition-colors hover:text-ink md:ml-3 md:h-9 md:w-9 md:border md:border-hairline md:bg-surface-2 md:hover:bg-surface-3"
      >
        <List size={20} aria-hidden="true" />
      </button>
      <Link to="/" className="ml-1 text-base font-bold tracking-widest text-primary uppercase md:hidden">
        Luna
      </Link>
      <form className="relative ml-3 hidden md:block" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={searchInputRef}
          type="search"
          aria-label="Search"
          placeholder="Search data for analysis"
          className="w-[220px] rounded-md border border-hairline bg-surface-2 py-1.5 pr-12 pl-3 text-sm text-ink outline-none placeholder:text-ink-subtle focus:ring-2 focus:ring-primary-focus/50"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle">
          {os === 'mac' ? '⌘K' : 'Ctrl K'}
        </kbd>
      </form>

      <button
        type="button"
        aria-label="Open search"
        onClick={() => setSearchOpen(true)}
        className="ml-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-ink-subtle transition-colors hover:text-ink md:hidden"
      >
        <MagnifyingGlass size={20} aria-hidden="true" />
      </button>

      <div
        className="relative mr-3 ml-auto hidden md:block"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setLocaleOpen(false)
        }}
      >
        <button
          type="button"
          aria-label={`Language: ${locale.toUpperCase()}`}
          aria-haspopup="menu"
          aria-expanded={localeOpen}
          onClick={() => setLocaleOpen((o) => !o)}
          className="flex cursor-pointer items-center gap-1 rounded-md border border-hairline bg-surface-1 px-2 py-1 text-xs font-medium text-ink transition-colors outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary-focus/50"
        >
          <Globe size={14} aria-hidden="true" /> {locale.toUpperCase()}
          <CaretDown size={10} aria-hidden="true" />
        </button>
        {localeOpen && (
          <div role="menu" className="card absolute top-full right-0 z-40 mt-1 w-24 p-1">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                role="menuitemradio"
                aria-checked={l === locale}
                onClick={() => {
                  setLocale(l)
                  setLocaleOpen(false)
                }}
                className={`block w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-2 ${l === locale ? 'font-medium text-ink' : 'text-ink-muted'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="mr-4 hidden cursor-pointer text-ink-subtle hover:text-ink md:block"
      >
        {theme === 'dark' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
      <Link to="/login" className="flex h-11 items-center gap-2 p-1 text-sm text-ink-subtle hover:text-ink">
        <span className="hidden lowercase md:inline">luna@company.io</span>
        <img src={profile} alt="Account" className="h-9 w-9 rounded-full" />
      </Link>

      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-overlay/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 border-b border-hairline bg-canvas px-3">
            <MagnifyingGlass size={18} aria-hidden="true" className="shrink-0 text-ink-subtle" />
            <input
              autoFocus
              type="search"
              aria-label="Search"
              placeholder="Search data for analysis"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-subtle transition-colors hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </nav>
  )
}
