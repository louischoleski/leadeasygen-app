import { useRegister } from '@fonderie/react-auth'
import { Envelope, User } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useTranslation } from '../hooks/useTranslation'
import { applyAuthError } from '../lib/authErrors'
import { useAppSession } from '../lib/session'

interface RegisterValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { register: registerAccount, isLoading } = useRegister()
  const { refresh } = useAppSession()

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>()

  const onSubmit = async ({ name, email, password }: RegisterValues) => {
    const [firstName, ...rest] = name.trim().split(/\s+/)
    try {
      await registerAccount({
        email: email.trim(),
        password,
        firstName,
        lastName: rest.join(' ') || undefined,
      })
      await refresh({ force: true })
      navigate('/')
    } catch (err) {
      applyAuthError(
        err,
        setError,
        {
          USER_ALREADY_EXISTS: 'email',
          email: 'email',
          password: 'password',
          firstName: 'name',
          lastName: 'name',
        },
        t('auth.register.failed'),
      )
    }
  }

  return (
    <AuthCard title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={t('auth.register.name')}
          id="name"
          iconLeft={User}
          error={errors.name?.message}
          containerClassName="mb-4"
          {...register('name', { required: t('auth.register.errors.nameRequired') })}
        />
        <Input
          label={t('auth.register.email')}
          id="email"
          type="email"
          placeholder={t('auth.register.emailPlaceholder')}
          iconLeft={Envelope}
          error={errors.email?.message}
          containerClassName="mb-4"
          {...register('email', {
            required: t('auth.register.errors.emailRequired'),
            pattern: { value: /^\S+@\S+\.\S+$/, message: t('auth.register.errors.emailInvalid') },
          })}
        />
        <Input
          label={t('auth.register.password')}
          id="password"
          type="password"
          error={errors.password?.message}
          containerClassName="mb-4"
          {...register('password', {
            required: t('auth.register.errors.passwordRequired'),
            minLength: { value: 8, message: t('auth.register.errors.passwordMinLength') },
          })}
        />
        <Input
          label={t('auth.register.confirmPassword')}
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          containerClassName="mb-4"
          {...register('confirmPassword', {
            required: t('auth.register.errors.confirmRequired'),
            validate: (value) =>
              value === getValues('password') || t('auth.register.errors.passwordMismatch'),
          })}
        />
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="accept-terms"
              aria-invalid={!!errors.acceptTerms}
              aria-describedby={errors.acceptTerms ? 'accept-terms-message' : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              {...register('acceptTerms', {
                required: t('auth.register.errors.termsRequired'),
              })}
            />
            <label htmlFor="accept-terms" className="text-sm text-ink-subtle">
              {t('auth.register.termsAgree')}{' '}
              <Link to="/terms" className="text-link underline">
                {t('auth.register.termsOfService')}
              </Link>{' '}
              {t('auth.register.termsAnd')}{' '}
              <Link to="/privacy" className="text-link underline">
                {t('auth.register.privacyPolicy')}
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p id="accept-terms-message" className="mt-1.5 text-xs text-error">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Button type="submit" fullWidth loading={isLoading}>{t('auth.register.submit')}</Button>
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
                4. Restore the GoogleLogo + sonner toast imports, point this button at
                   `${API_BASE_URL}/auth/google`, and drop the toast.
                   The auth.*.google copy is already translated in en/fr/es.
          <Button
            type="button"
            variant="secondary"
            fullWidth
            iconLeft={GoogleLogo}
            onClick={() => toast.info(t('auth.register.googleUnavailable'))}
          >
            {t('auth.register.google')}
          </Button>
          */}
        </div>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          {t('auth.register.haveAccount')}{' '}
          <Link to="/login" className="text-link underline">{t('auth.register.logIn')}</Link>
        </p>
      </form>
    </AuthCard>
  )
}
