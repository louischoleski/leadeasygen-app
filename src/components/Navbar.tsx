import { List } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import profile from '../assets/profile.jpg'

export default function Navbar({ onToggleNav }: { onToggleNav: () => void }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex h-[60px] items-center bg-white shadow-[0_0_21px_#161616]">
      <Link
        to="/"
        className="flex h-full w-[200px] shrink-0 items-center bg-accent px-6 text-[1.12rem] tracking-[10px] text-[#2f323b] hover:bg-[#f5a212]"
      >
        LUNA<span className="ml-1 text-xs tracking-normal text-[#2f323b]">v.1.4</span>
      </Link>
      <button
        type="button"
        aria-label="Toggle navigation"
        onClick={onToggleNav}
        className="ml-2.5 cursor-pointer text-muted hover:text-accent"
      >
        <List size={30} aria-hidden="true" />
      </button>
      <form className="ml-2.5 hidden md:block" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          aria-label="Search"
          placeholder="Search data for analysis"
          className="w-[175px] rounded px-3 py-1.5 text-[0.88rem] text-muted outline-none placeholder:text-[#6f7780]"
        />
      </form>
      <Link
        to="/login"
        className="mr-4 ml-auto flex items-center gap-2 text-[0.84rem] text-[#6a727a] hover:text-[#3b3f44]"
      >
        <span className="lowercase">luna@company.io</span>
        <img src={profile} alt="" className="h-9 w-9 rounded-full" />
      </Link>
    </nav>
  )
}
