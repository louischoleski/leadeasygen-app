import { Key } from '@phosphor-icons/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
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
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="password">New password</label>
            <input type="password" required name="password" id="password" className="input" />
            <span className="text-xs text-ink-subtle">Your hard to guess password</span>
          </div>
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="repeatPassword">Repeat new password</label>
            <input type="password" required name="repeatPassword" id="repeatPassword" className="input" />
            <span className="text-xs text-ink-subtle">Please repeat your password</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">Reset password</button>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
