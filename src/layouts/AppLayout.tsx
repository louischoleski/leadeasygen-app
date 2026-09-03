import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useViewport } from '../hooks/useViewport'

export default function AppLayout() {
  const { isDesktop } = useViewport()
  const [navOpen, setNavOpen] = useState(isDesktop)

  // Entering mobile: collapse the drawer so it never appears open mid-resize
  useEffect(() => {
    if (!isDesktop) setNavOpen(false)
  }, [isDesktop])

  // On mobile the sidebar is a modal drawer: close it on Escape
  useEffect(() => {
    if (!navOpen || isDesktop) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen, isDesktop])

  const closeIfMobile = () => {
    if (!isDesktop) setNavOpen(false)
  }

  return (
    <div>
      <Navbar onToggleNav={() => setNavOpen((open) => !open)} />
      {navOpen && (
        <div
          className="fixed inset-0 z-10 bg-overlay/50 md:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar open={navOpen} onNavigate={closeIfMobile} />
      <main className={`pt-14 transition-[margin] duration-300 ${navOpen ? 'md:ml-[200px]' : ''}`}>
        <div className="p-[30px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
