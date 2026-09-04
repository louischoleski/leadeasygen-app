import { useForgotPassword } from '@fonderie/react-auth'
import { CheckCircle, Envelope } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { applyAuthError } from '../lib/authErrors'

interface ForgotValues {
  email: string
}

export default function ForgotPassword() {
  const { forgotPassword, isLoading, sent } = useForgotPassword()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotValues>()

  // The server answers identically whether the account exists or not
  const onSubmit = async ({ email }: ForgotValues) => {
    try {
      await forgotPassword(email.trim())
    } catch (err) {
      applyAuthError(err, setError, { email: 'email' }, 'Could not send the reset email')
    }
  }

  if (sent) {
    return (
      <AuthCard title="Check your inbox" subtitle="If an account exists for that email, a 6-digit reset code is on its way">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-success" aria-hidden="true" />
        <Button fullWidth asChild>
          <Link to="/reset-password">Enter reset code</Link>
        </Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          <Link to="/login" className="text-link underline">Back to login</Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we'll send you a 6-digit reset code">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="m@example.com"
          iconLeft={Envelope}
          error={errors.email?.message}
          containerClassName="mb-6"
          {...register('email', {
            required: 'Enter your email',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Button type="submit" fullWidth loading={isLoading}>Send reset code</Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Remember your password?{' '}
          <Link to="/login" className="text-link underline">Log in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
