import { FonderieProvider } from '@fonderie/react'
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import { fonderie } from './lib/fonderie'
import { SessionProvider } from './lib/session'
import { GuestOnly, RequireAuth } from './components/RouteGuards'
import { useTheme } from './hooks/useTheme'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import Billing from './pages/Billing'
import CheckoutCancelled from './pages/CheckoutCancelled'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Faq from './pages/Faq'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Register from './pages/Register'
import Terms from './pages/Terms'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

// Lazy so react-select loads only with the settings page
const Settings = lazy(() => import('./pages/Settings'))

// Lazy so the charting library loads only with the dashboard, not the auth pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const JobDetail = lazy(() => import('./pages/JobDetail'))

function AppToaster() {
  const { theme } = useTheme()
  return <Toaster position="top-right" theme={theme} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FonderieProvider client={fonderie}>
      <SessionProvider>
        <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
          <Route index element={<Suspense fallback={null}><Dashboard /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={null}><Settings /></Suspense>} />
          <Route path="/jobs/:id" element={<Suspense fallback={null}><JobDetail /></Suspense>} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/success" element={<CheckoutSuccess />} />
          <Route path="/billing/cancelled" element={<CheckoutCancelled />} />
          <Route path="/faq" element={<Faq />} />
          {/* Legacy paths from earlier iterations */}
          <Route path="/credits" element={<Navigate to="/billing" replace />} />
          <Route path="/subscription" element={<Navigate to="/billing" replace />} />
          </Route>
        </Route>
        <Route element={<GuestOnly />}>
          <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
          </Route>
        </Route>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Redirects for URLs of the former static site */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/login.html" element={<Navigate to="/login" replace />} />
        <Route path="/register.html" element={<Navigate to="/register" replace />} />
        <Route path="/forgotPassword.html" element={<Navigate to="/forgot-password" replace />} />
        <Route path="*" element={<NotFound />} />
          </Routes>
          <AppToaster />
        </BrowserRouter>
      </SessionProvider>
    </FonderieProvider>
  </StrictMode>,
)
