import { Globe, List, MagnetStraight, MagnifyingGlass, Monitor, Moon, Sun, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.jpg'
import { IconButton } from './IconButton'
import LocaleMenu from './LocaleMenu'
import { SHORTCUTS } from '../constants/shortcuts'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import { localeNames, useLocale } from '../hooks/useLocale'
import { useOS } from '../hooks/useOS'
import { themeModes, useTheme } from '../hooks/useTheme'
import { useViewport } from '../hooks/useViewport'

export default function Navbar({ onToggleNav }: { onToggleNav: () => void }) {
  const { theme, mode, setThemeMode } = useTheme()
  const { locale } = useLocale()
  const { isMobile } = useViewport()
  const os = useOS()
  const [localeOpen, setLocaleOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const ThemeIcon = mode === 'system' ? Monitor : theme === 'dark' ? Moon : Sun
  const searchInputRef = useRef<HTMLInputElement>(null)

  // The overlay is a mobile-only pattern: close it when the viewport leaves mobile
  useEffect(() => {
    if (!isMobile && searchOpen) setSearchOpen(false)
  }, [isMobile, searchOpen])

  // On mobile the shortcut is meaningless (no hardware keyboard assumption) and
  // the overlay would be closed by the guard above, so focus the inline input.
  useKeyboardShortcut(
    SHORTCUTS.search.key,
    () => {
      if (!isMobile) searchInputRef.current?.focus()
    },
    { meta: SHORTCUTS.search.meta && os === 'mac', ctrl: SHORTCUTS.search.ctrl && os !== 'mac' },
  )
  useKeyboardShortcut(SHORTCUTS.close.key, () => setSearchOpen(false), {
    preventDefault: SHORTCUTS.close.preventDefault,
  })

  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-hairline bg-canvas pr-3 pl-1 md:pr-4 md:pl-0">
      {/* Brand slab: md+ only, 200px to align with the sidebar edge, gone on mobile */}
      <Link
        to="/"
        className="hidden h-full w-[200px] shrink-0 items-center gap-2 bg-primary px-5 transition-colors hover:bg-primary-hover md:flex"
      >
        <MagnetStraight size={20} aria-hidden="true" className="shrink-0 text-on-primary" />
        <span className="text-sm font-semibold tracking-tight text-on-primary">LeadEasyGen</span>
      </Link>
      <IconButton icon={List} variant="ghost" aria-label="Toggle navigation" onClick={onToggleNav} className="md:ml-2" />
      <Link to="/" className="ml-1 flex items-center gap-2 md:hidden">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
          <MagnetStraight size={14} aria-hidden="true" className="text-on-primary" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-ink">LeadEasyGen</span>
      </Link>
      <form className="relative ml-3 hidden md:block" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={searchInputRef}
          type="search"
          aria-label="Search"
          placeholder="Search data for analysis"
          className="w-[250px] rounded-md border border-hairline bg-surface-2 py-1.5 pr-12 pl-3 text-sm text-ink outline-none placeholder:text-ink-subtle focus:ring-2 focus:ring-primary-focus/50"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle">
          {SHORTCUTS.search.label(os)}
        </kbd>
      </form>

      <IconButton
        icon={MagnifyingGlass}
        variant="ghost"
        aria-label="Open search"
        onClick={() => setSearchOpen(true)}
        className="ml-auto md:hidden"
      />

      <div
        className="relative mr-1 ml-auto hidden md:block"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setLocaleOpen(false)
        }}
      >
        <IconButton
          icon={Globe}
          variant="ghost"
          size="sm"
          aria-label={`Language: ${localeNames[locale]}`}
          aria-haspopup="menu"
          aria-expanded={localeOpen}
          onClick={() => setLocaleOpen((o) => !o)}
        />
        {localeOpen && (
          <LocaleMenu className="top-full right-0 mt-1 w-36" onSelect={() => setLocaleOpen(false)} />
        )}
      </div>
      <div
        className="relative mr-3 hidden md:block"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setThemeOpen(false)
        }}
      >
        <IconButton
          icon={ThemeIcon}
          variant="ghost"
          size="sm"
          aria-label={`Theme: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
          aria-haspopup="menu"
          aria-expanded={themeOpen}
          onClick={() => setThemeOpen((o) => !o)}
        />
        {themeOpen && (
          <div role="menu" className="card absolute top-full right-0 z-40 mt-1 w-28 p-1">
            {themeModes.map((m) => (
              <button
                key={m}
                type="button"
                role="menuitemradio"
                aria-checked={m === mode}
                onClick={() => {
                  setThemeMode(m)
                  setThemeOpen(false)
                }}
                className={`block w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-2 ${m === mode ? 'font-medium text-ink' : 'text-ink-muted'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <Link to="/login" className="flex h-11 items-center gap-2 p-1 text-sm text-ink-subtle hover:text-ink">
        <span className="hidden lowercase lg:inline">user@leadeasygen.com</span>
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
            <IconButton
              icon={X}
              variant="ghost"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="shrink-0"
            />
          </div>
        </>
      )}
    </nav>
  )
}
