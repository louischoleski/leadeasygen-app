import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const isMobile = () => window.matchMedia('(max-width: 767px)').matches

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(() => !isMobile())

  // On mobile the sidebar is a modal drawer: close it on Escape
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile()) setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  const closeIfMobile = () => {
    if (isMobile()) setNavOpen(false)
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
