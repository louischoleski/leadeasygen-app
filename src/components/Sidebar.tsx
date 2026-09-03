import { CaretDown, Moon, Sun, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { locales, useLocale } from '../hooks/useLocale'
import useLocalStorage from '../hooks/useLocalStorage'
import { useTheme } from '../hooks/useTheme'

const tips = [
  { label: 'Tip', text: 'Use radius + keywords together for tighter lead targeting.' },
  { label: 'Tip', text: 'Radius under 5km finds hyper-local businesses.' },
  { label: 'New', text: 'Export results directly to CSV from the dashboard.' },
  { label: 'Did you know?', text: "Visiting a business's website often reveals emails not listed on Maps." },
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
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useLocale()
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

      {/* Rotating onboarding tip — desktop only, the drawer is too cramped */}
      {!tipHidden && (
        <div className="relative mx-2 mt-auto mb-4 hidden rounded-lg border border-hairline bg-surface-2 p-3 md:block">
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
      <div className="border-t border-hairline px-6 py-4 md:hidden">
        <div className="text-eyebrow mb-2 text-ink">Settings</div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Language">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={l === locale}
              onClick={() => setLocale(l)}
              className={`h-9 min-w-11 cursor-pointer rounded-md border px-2 text-xs font-medium transition-colors ${l === locale ? 'border-primary text-link' : 'border-hairline text-ink-subtle hover:text-ink'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={theme === 'dark'}
          onClick={toggleTheme}
          className="mt-3 flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border border-hairline px-3 text-sm text-ink-subtle transition-colors hover:text-ink"
        >
          {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
          {theme === 'dark' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>
    </aside>
  )
}
