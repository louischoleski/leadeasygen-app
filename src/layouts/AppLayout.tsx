import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)

  return (
    <div>
      <Navbar onToggleNav={() => setNavOpen((open) => !open)} />
      <Sidebar open={navOpen} />
      <main className={`pt-[60px] transition-[margin] duration-300 ${navOpen ? 'md:ml-[200px]' : ''}`}>
        <div className="p-[30px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
