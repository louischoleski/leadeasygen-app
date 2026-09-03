import { Envelope } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

interface ForgotValues {
  email: string
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>()

  // Always report success — never reveal whether an email exists
  const onSubmit = () => {
    toast.success('Reset link sent', { description: 'Check your inbox.' })
  }

  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we'll send you a reset link">
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
        <Button type="submit" fullWidth>Send reset link</Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Remember your password?{' '}
          <Link to="/login" className="text-link underline">Log in</Link>
        </p>
      </form>
    </AuthCard>
  )
}
