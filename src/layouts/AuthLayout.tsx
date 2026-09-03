import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <section className="min-h-screen p-2.5">
      <div className="m-2.5">
        <Link to="/" className="btn btn-accent">Back to Dashboard</Link>
      </div>
      <div className="grid grid-cols-1 justify-items-center">
        <Outlet />
      </div>
    </section>
  )
}
