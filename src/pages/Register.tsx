import { Envelope, GoogleLogo, User } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { login } from '../data/auth'

interface RegisterValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>()

  const onSubmit = ({ name, email }: RegisterValues) => {
    login({ name: name.trim() || email.trim().split('@')[0], email: email.trim() })
    navigate('/')
  }

  return (
    <AuthCard title="Sign up" subtitle="Enter your details below to create your account">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full name"
          id="name"
          iconLeft={User}
          error={errors.name?.message}
          containerClassName="mb-4"
          {...register('name', { required: 'Enter your name' })}
        />
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="m@example.com"
          iconLeft={Envelope}
          error={errors.email?.message}
          containerClassName="mb-4"
          {...register('email', {
            required: 'Enter your email',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          error={errors.password?.message}
          containerClassName="mb-4"
          {...register('password', {
            required: 'Enter a password',
            minLength: { value: 8, message: 'Use at least 8 characters' },
          })}
        />
        <Input
          label="Confirm password"
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          containerClassName="mb-4"
          {...register('confirmPassword', {
            required: 'Repeat your password',
            validate: (value) => value === getValues('password') || 'Passwords do not match',
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
                required: 'Please accept the Terms of Service and Privacy Policy',
              })}
            />
            <label htmlFor="accept-terms" className="text-sm text-ink-subtle">
              I agree to the{' '}
              <Link to="/terms" className="text-link underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-link underline">
                Privacy Policy
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
          <Button type="submit" fullWidth>Sign up</Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            iconLeft={GoogleLogo}
            onClick={() => toast('Google sign-up is not wired up yet')}
          >
            Sign up with Google
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Already have an account?{' '}
          <Link to="/login" className="text-link underline">Log in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
