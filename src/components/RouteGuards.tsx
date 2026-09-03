import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../data/auth'

// Route-level guards: wrap a layout route group, gate via Outlet.
// Public routes (terms, privacy) simply sit outside both groups.

export function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export function GuestOnly() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <Outlet />
}
