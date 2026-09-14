import { isMfaRequired, useLogin, useAuthProviders } from '@fonderie/react-auth'
import { Envelope } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { API_BASE_URL } from '../lib/fonderie'
import { Button } from '../components/Button'
import { ProviderIcon } from '../components/ProviderIcon'
import { Input } from '../components/Input'
import { useTranslation } from '../hooks/useTranslation'
import { applyAuthError } from '../lib/authErrors'
import { useAppSession } from '../lib/session'

interface LoginValues {
  email: string
  password: string
}

export default function Login() {
  const providers = useAuthProviders()
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
          {/* Rendered only when the API says it can honour Google. The server
              holds the credentials, so it is the only honest source — a
              build-time flag here would let the two disagree and the user
              would land on Google's error page. Navigate TOP-LEVEL rather
              than fetch(): the API's start route sets the CSRF state cookie,
              and a cross-site fetch cannot reliably store it. */}
          {providers.has('google') && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                window.location.href = `${API_BASE_URL}/auth/google/start`
              }}
            >
              <ProviderIcon provider="google" />
              {t('auth.login.google')}
            </Button>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-link underline">{t('auth.login.signUp')}</Link>
        </p>
      </form>
    </AuthCard>
  )
}
