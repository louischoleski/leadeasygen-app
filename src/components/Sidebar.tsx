import { CaretDown, Coin, GearSix, Globe, Lifebuoy, Monitor, Moon, SquaresFour, Sun, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconButton } from './IconButton'
import LocaleMenu from './LocaleMenu'
import { ToggleGroup } from './Toggle'
import { useLocale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'
import { useTheme } from '../hooks/useTheme'

const themeOptions = [
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
] as const

const mainLinks = [
  { to: '/', label: 'Dashboard', icon: SquaresFour, end: true },
  { to: '/billing', label: 'Billing', icon: Coin },
  { to: '/settings', label: 'Settings', icon: GearSix },
  { to: '/help', label: 'Help Center', icon: Lifebuoy },
]

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
          {mainLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                onClick={onNavigate}
                className={({ isActive }) => `${isActive ? activeClass : linkClass} gap-2.5`}
              >
                <link.icon size={16} aria-hidden="true" className="shrink-0" />
                {link.label}
              </NavLink>
            </li>
          ))}
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
          <IconButton
            icon={X}
            variant="ghost"
            size="xs"
            aria-label="Dismiss tip"
            onClick={dismissTip}
            className="absolute top-1 right-1"
          />
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
          <ToggleGroup value={mode} onValueChange={setThemeMode} options={[...themeOptions]} aria-label="Theme" />
        </div>
      </div>
    </aside>
  )
}
