import { List, Moon, Sun } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.jpg'
import { useTheme } from '../hooks/useTheme'

export default function Navbar({ onToggleNav }: { onToggleNav: () => void }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-hairline bg-canvas px-4">
      <Link to="/" className="flex items-baseline gap-1.5 text-base font-semibold tracking-widest text-ink">
        LUNA<span className="text-xs font-normal tracking-normal text-ink-subtle">v.1.4</span>
      </Link>
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleNav}
        className="ml-3 cursor-pointer text-ink-subtle hover:text-ink"
      >
        <List size={22} aria-hidden="true" />
      </button>
      <form className="ml-4 hidden md:block" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          aria-label="Search"
          placeholder="Search data for analysis"
          className="w-[200px] rounded-md border border-hairline bg-surface-2 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-ink-subtle focus:ring-2 focus:ring-primary-focus/50"
        />
      </form>
      <button
        type="button"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="mr-4 ml-auto cursor-pointer text-ink-subtle hover:text-ink"
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
