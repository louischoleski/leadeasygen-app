import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import { useTheme } from './hooks/useTheme'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import Billing from './pages/Billing'
import CheckoutCancelled from './pages/CheckoutCancelled'
import CheckoutSuccess from './pages/CheckoutSuccess'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

// Lazy so react-select loads only with the settings page
const Settings = lazy(() => import('./pages/Settings'))

// Lazy so the charting library loads only with the dashboard, not the auth pages
const Dashboard = lazy(() => import('./pages/Dashboard'))

function AppToaster() {
  const { theme } = useTheme()
  return <Toaster position="top-right" theme={theme} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Suspense fallback={null}><Dashboard /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={null}><Settings /></Suspense>} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/success" element={<CheckoutSuccess />} />
          <Route path="/billing/cancelled" element={<CheckoutCancelled />} />
          {/* Legacy paths from earlier iterations */}
          <Route path="/credits" element={<Navigate to="/billing" replace />} />
          <Route path="/subscription" element={<Navigate to="/billing" replace />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
        </Route>
        {/* Redirects for URLs of the former static site */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/login.html" element={<Navigate to="/login" replace />} />
        <Route path="/register.html" element={<Navigate to="/register" replace />} />
        <Route path="/forgotPassword.html" element={<Navigate to="/forgot-password" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AppToaster />
    </BrowserRouter>
  </StrictMode>,
)
