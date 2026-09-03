import { Envelope, GoogleLogo, User } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { login } from '../data/auth'

export default function Register() {
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirmPassword')) {
      toast.error('Passwords do not match')
      return
    }
    if (!accepted) {
      toast.error('Please accept the Terms of Service and Privacy Policy')
      return
    }
    const email = String(data.get('email') ?? '').trim()
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    login({ name: String(data.get('name') ?? '').trim() || email.split('@')[0], email })
    navigate('/')
  }

  return (
    <AuthCard title="Sign up" subtitle="Enter your details below to create your account">
      <form noValidate onSubmit={handleSubmit}>
        <Input
          label="Full name"
          id="name"
          name="name"
          iconLeft={User}
          required
          containerClassName="mb-4"
        />
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
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          containerClassName="mb-4"
        />
        <Input
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          containerClassName="mb-4"
        />
        <div className="mb-6 flex items-start gap-2">
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
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
