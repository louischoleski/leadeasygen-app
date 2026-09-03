import { CaretDown, Globe, List, Moon, Sun } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.jpg'
import { useTheme } from '../hooks/useTheme'

const locales = ['en', 'fr', 'es'] as const
type Locale = (typeof locales)[number]

export default function Navbar({ onToggleNav }: { onToggleNav: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const [locale, setLocale] = useState<Locale>('en')
  const [localeOpen, setLocaleOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-hairline bg-canvas pr-4">
      <Link
        to="/"
        className="flex h-full w-[200px] shrink-0 items-center gap-2 bg-primary px-5 transition-colors hover:bg-primary-hover"
      >
        <span className="text-sm font-semibold tracking-[0.3em] text-on-primary uppercase">Luna</span>
        {/* black-tint pill: the spec'd white-tint fails AA contrast under the wordmark */}
        <span className="rounded-full bg-overlay/25 px-1.5 py-0.5 text-[10px] font-medium text-on-primary">
          v1.4
        </span>
      </Link>
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleNav}
        className="ml-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-hairline bg-surface-2 text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink"
      >
        <List size={18} aria-hidden="true" />
      </button>
      <form className="ml-3 hidden md:block" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          aria-label="Search"
          placeholder="Search data for analysis"
          className="w-[200px] rounded-md border border-hairline bg-surface-2 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-ink-subtle focus:ring-2 focus:ring-primary-focus/50"
        />
      </form>

      <div
        className="relative mr-3 ml-auto"
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
        className="mr-4 cursor-pointer text-ink-subtle hover:text-ink"
      >
        {theme === 'dark' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </button>
      <Link to="/login" className="flex items-center gap-2 text-sm text-ink-subtle hover:text-ink">
        <span className="lowercase">luna@company.io</span>
        <img src={profile} alt="" className="h-8 w-8 rounded-full" />
      </Link>
    </nav>
  )
}
