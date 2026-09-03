import { CaretDown, Shield } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const categoryClass = 'mt-2.5 px-6 py-2 text-eyebrow text-ink'
const linkClass = 'block py-2 pl-6 text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink'
const subLinkClass = 'block py-2 pl-10 text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink'

export default function Sidebar({ open }: { open: boolean }) {
  const [commonOpen, setCommonOpen] = useState(false)

  return (
    <aside
      className={`fixed top-14 bottom-0 left-0 z-20 w-[200px] overflow-y-auto border-r border-hairline bg-sidebar pt-4 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav>
        <ul>
          <li className={categoryClass}>Main</li>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${linkClass} border-l-2 border-primary bg-surface-2 pl-[22px] text-ink` : linkClass
              }
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
              className="flex w-full cursor-pointer items-center justify-between py-2 pr-4 pl-6 text-ink-subtle transition-colors hover:text-ink"
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
                <li><NavLink to="/login" className={subLinkClass}>Login</NavLink></li>
                <li><NavLink to="/register" className={subLinkClass}>Register</NavLink></li>
                <li><NavLink to="/forgot-password" className={subLinkClass}>Forgot password</NavLink></li>
              </ul>
            )}
          </li>
          <li className="mt-12 px-6 py-5 text-xs text-ink-subtle">
            <Shield size={34} aria-hidden="true" className="text-primary" />
            <div className="mt-1">
              <span className="text-ink">LUNA</span> admin theme with Dark UI style for monitoring and
              administration web applications.
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
