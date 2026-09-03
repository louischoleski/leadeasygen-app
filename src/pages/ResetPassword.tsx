import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirmPassword')) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password updated. Please log in with your new password.')
    navigate('/login')
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter your new password below">
      <form noValidate onSubmit={handleSubmit}>
        {!token && (
          <p className="mb-4 text-xs text-error">
            This link is missing its reset token. Request a new one from the forgot password page.
          </p>
        )}
        <Input
          label="New password"
          id="password"
          name="password"
          type="password"
          required
          containerClassName="mb-4"
        />
        <Input
          label="Confirm new password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          containerClassName="mb-6"
        />
        <Button type="submit" fullWidth>Reset password</Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          <Link to="/login" className="text-link underline">Back to login</Link>
        </p>
      </form>
    </AuthCard>
  )
}
