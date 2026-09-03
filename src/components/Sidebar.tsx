import { CaretDown, Globe, Monitor, Moon, Sun, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import LocaleMenu from './LocaleMenu'
import { useLocale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'
import { themeModes, useTheme, type ThemeMode } from '../hooks/useTheme'

const themeModeIcons: Record<ThemeMode, typeof Monitor> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

const tips = [
  { label: 'Tip', text: 'Use radius + keywords together for tighter lead targeting.' },
  { label: 'Tip', text: 'Radius under 5km finds hyper-local businesses.' },
  { label: 'New', text: 'Export results directly to CSV from the dashboard.' },
  { label: 'Did you know', text: "Visiting a business's website often reveals emails not listed on Maps." },
]

const categoryClass = 'mt-2.5 px-6 py-2 text-eyebrow text-ink'
const itemClass = 'mx-2 flex h-11 items-center rounded-lg px-4 transition-colors'
const linkClass = `${itemClass} text-ink-muted hover:bg-surface-2/50 hover:text-ink`
const activeClass = `${itemClass} bg-surface-2 font-medium text-link`
const subLinkClass = `${itemClass} pl-8 text-ink-muted hover:bg-surface-2/50 hover:text-ink`

type Props = {
  open: boolean
  onNavigate: () => void
}

export default function Sidebar({ open, onNavigate }: Props) {
  const [commonOpen, setCommonOpen] = useState(false)
  const { mode, setThemeMode } = useTheme()
  const { locale } = useLocale()
  const [localeOpen, setLocaleOpen] = useState(false)
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)])
  const [tipHidden, setTipHidden] = useLocalStorage('hideSidebarTip', false)

  const dismissTip = () => setTipHidden(true)

  return (
    <aside
      className={`fixed top-14 bottom-0 left-0 z-20 flex w-[280px] flex-col overflow-y-auto border-r border-hairline bg-sidebar pt-4 transition-transform duration-300 md:w-[200px] ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav className="flex-1">
        <ul>
          <li className={categoryClass}>Main</li>
          <li>
            <NavLink
              to="/"
              end
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? activeClass : linkClass)}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? activeClass : linkClass)}
            >
              Settings
            </NavLink>
          </li>
          <li className={categoryClass}>App Pages</li>
          <li>
            <button
              type="button"
              onClick={() => setCommonOpen((o) => !o)}
              aria-expanded={commonOpen}
              className={`${linkClass} w-[calc(100%-1rem)] cursor-pointer justify-between`}
            >
              Common
              <CaretDown
                size={14}
                aria-hidden="true"
                className={`transition-transform ${commonOpen ? '' : '-rotate-90'}`}
              />
            </button>
            {commonOpen && (
              <ul>
                <li><NavLink to="/login" onClick={onNavigate} className={subLinkClass}>Login</NavLink></li>
                <li><NavLink to="/register" onClick={onNavigate} className={subLinkClass}>Register</NavLink></li>
                <li>
                  <NavLink to="/forgot-password" onClick={onNavigate} className={subLinkClass}>
                    Forgot password
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Rotating onboarding tip; dismissing it hides it on all surfaces */}
      {!tipHidden && (
        <div className="relative mx-2 mt-auto mb-4 rounded-lg border border-hairline bg-surface-2 p-3">
          <button
            type="button"
            onClick={dismissTip}
            aria-label="Dismiss tip"
            className="absolute top-2 right-2 cursor-pointer p-1 text-ink-subtle hover:text-ink"
          >
            <X size={12} aria-hidden="true" />
          </button>
          <p className="pr-4 text-xs text-ink-subtle">
            <span className="font-medium text-link">{tip.label}:</span> {tip.text}
          </p>
        </div>
      )}

      {/* Locale and theme live in the navbar on md+; the drawer hosts them on mobile */}
      <div className="space-y-2 border-t border-hairline px-4 py-3 md:hidden">
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setLocaleOpen(false)
          }}
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={localeOpen}
            onClick={() => setLocaleOpen((o) => !o)}
            className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg px-1 text-sm transition-colors hover:bg-surface-2"
          >
            <span className="flex items-center gap-2 text-ink-muted">
              <Globe size={16} aria-hidden="true" className="text-ink-subtle" /> Language
            </span>
            <span className="flex items-center gap-1 text-ink">
              {locale.toUpperCase()} <CaretDown size={12} aria-hidden="true" className="text-ink-subtle" />
            </span>
          </button>
          {/* Opens upward: the trigger sits at the drawer bottom, and a downward
              menu would be clipped by the drawer's own scroll container */}
          {localeOpen && (
            <LocaleMenu className="bottom-full left-0 mb-1 w-full" onSelect={() => setLocaleOpen(false)} />
          )}
        </div>
        <div className="flex h-11 items-center justify-between px-1">
          <span className="flex items-center gap-2 text-sm text-ink-muted">
            <Monitor size={16} aria-hidden="true" className="text-ink-subtle" /> Theme
          </span>
          <div className="flex rounded-full border border-hairline bg-surface-2 p-0.5" role="group" aria-label="Theme">
            {themeModes.map((m) => {
              const ModeIcon = themeModeIcons[m]
              return (
                <button
                  key={m}
                  type="button"
                  aria-label={m.charAt(0).toUpperCase() + m.slice(1)}
                  aria-pressed={mode === m}
                  onClick={() => setThemeMode(m)}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors ${
                    mode === m ? 'bg-surface-1 text-ink shadow-sm' : 'text-ink-subtle hover:text-ink'
                  }`}
                >
                  <ModeIcon size={14} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
