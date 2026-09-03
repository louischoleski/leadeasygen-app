import { Key } from '@phosphor-icons/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import ViewHeader from '../components/ViewHeader'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('repeatPassword')) {
      toast.error('Passwords do not match')
      return
    }
    toast.success('Password updated. Please log in with your new password.')
    navigate('/login')
  }

  return (
    <AuthCard>
      <ViewHeader icon={Key} title="Choose a new password">
        Enter and confirm your new password to finish resetting it.
      </ViewHeader>
      <div className="card p-6">
        {!token && (
          <p className="mb-4 text-xs text-error">
            This link is missing its reset token. Request a new one from the forgot password page.
          </p>
        )}
        <form className="grid grid-cols-1" noValidate onSubmit={handleSubmit}>
          <Input
            label="New password"
            id="password"
            name="password"
            type="password"
            required
            helperText="Your hard to guess password"
            containerClassName="mb-4"
          />
          <Input
            label="Repeat new password"
            id="repeatPassword"
            name="repeatPassword"
            type="password"
            required
            helperText="Please repeat your password"
            containerClassName="mb-4"
          />
          <div className="flex items-center gap-2">
            <Button type="submit">Reset password</Button>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
