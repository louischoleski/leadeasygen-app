import { Link, Outlet } from 'react-router-dom'
import { Button } from '../components/Button'

export default function AuthLayout() {
  return (
    <main className="min-h-screen p-2.5">
      <div className="m-2.5">
        <Button asChild variant="secondary"><Link to="/">Back to Dashboard</Link></Button>
      </div>
      <div className="grid grid-cols-1 justify-items-center">
        <Outlet />
      </div>
    </main>
  )
}
