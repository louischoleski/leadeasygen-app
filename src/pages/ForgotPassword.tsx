import { Envelope } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export default function ForgotPassword() {
  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we'll send you a reset link">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          toast.success('Reset link sent', { description: 'Check your inbox.' })
        }}
      >
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          iconLeft={Envelope}
          required
          containerClassName="mb-6"
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
