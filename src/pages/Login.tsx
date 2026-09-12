import { isMfaRequired, useLogin } from '@fonderie/react-auth'
import { Envelope } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useTranslation } from '../hooks/useTranslation'
import { applyAuthError } from '../lib/authErrors'
import { useAppSession } from '../lib/session'

interface LoginValues {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { login, isLoading } = useLogin()
  const { refresh } = useAppSession()
  // RequireAuth stashes the page the visitor was headed for
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>()

  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      const result = await login({ email: email.trim(), password })
      if (isMfaRequired(result)) {
        // Challenge UI lands with the MFA phase; surface the state honestly
        toast.info(t('auth.login.mfaUnavailable'))
        return
      }
      await refresh({ force: true })
      navigate(from, { replace: true })
    } catch (err) {
      applyAuthError(
        err,
        setError,
        { INVALID_CREDENTIALS: 'password', email: 'email', password: 'password' },
        t('auth.login.failed'),
      )
    }
  }

  return (
    <AuthCard title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={t('auth.login.email')}
          id="email"
          type="email"
          placeholder={t('auth.login.emailPlaceholder')}
          iconLeft={Envelope}
          error={errors.email?.message}
          containerClassName="mb-4"
          {...register('email', {
            required: t('auth.login.errors.emailRequired'),
            pattern: { value: /^\S+@\S+\.\S+$/, message: t('auth.login.errors.emailInvalid') },
          })}
        />
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            {t('auth.login.password')}
          </label>
          <Link to="/forgot-password" className="text-sm text-link underline">
            {t('auth.login.forgotPassword')}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••"
          error={errors.password?.message}
          containerClassName="mb-6"
          {...register('password', { required: t('auth.login.errors.passwordRequired') })}
        />
        <div className="space-y-2">
          <Button type="submit" fullWidth loading={isLoading}>{t('auth.login.submit')}</Button>
          {/* TODO: Google sign-in — hidden until the OAuth flow is wired end to end.
              Showing a button that only raises "not available yet" reads as broken,
              and on an auth screen that costs trust at the worst moment.

              To re-enable:
                1. Google Cloud: OAuth 2.0 Web client, authorized redirect URI
                   <API_ORIGIN>/auth/google/callback (Google matches it exactly,
                   so it must be re-registered if the API domain changes).
                2. API: add 'google' to AuthModule providers + the google
                   { clientId, clientSecret, redirectUri } secrets block, which
                   mounts GET /auth/google and /auth/google/callback.
                3. Decide how the session gets back to this SPA: the callback
                   answers with JSON and sets SameSite=Strict cookies, so the app
                   and API must be same-site (they are not on *.vercel.app) or the
                   tokens need handing over explicitly.
                4. Restore the GoogleLogo import, point this button at
                   `${API_BASE_URL}/auth/google`, and drop the toast.
                   The auth.*.google copy is already translated in en/fr/es.
          <Button
            type="button"
            variant="secondary"
            fullWidth
            iconLeft={GoogleLogo}
            onClick={() => toast.info(t('auth.login.googleUnavailable'))}
          >
            {t('auth.login.google')}
          </Button>
          */}
        </div>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-link underline">{t('auth.login.signUp')}</Link>
        </p>
      </form>
    </AuthCard>
  )
}
