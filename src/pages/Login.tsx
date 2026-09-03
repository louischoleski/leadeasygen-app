import { Envelope, GoogleLogo } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export default function Login() {
  const navigate = useNavigate()

  return (
    <AuthCard title="Login" subtitle="Enter your email below to login to your account">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/')
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
          containerClassName="mb-4"
        />
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
          <Link to="/forgot-password" className="text-sm text-link underline">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••"
          required
          containerClassName="mb-6"
        />
        <div className="space-y-2">
          <Button type="submit" fullWidth>Login</Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            iconLeft={GoogleLogo}
            onClick={() => toast('Google sign-in is not wired up yet')}
          >
            Login with Google
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Don't have an account?{' '}
          <Link to="/register" className="text-link underline">Sign up</Link>
        </p>
      </form>
    </AuthCard>
  )
}
