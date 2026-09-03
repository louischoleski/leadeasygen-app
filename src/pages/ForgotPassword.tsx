import { IdentificationCard } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import ViewHeader from '../components/ViewHeader'

export default function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <ViewHeader icon={IdentificationCard} title="Reset password">
        Please enter your email to reset your password.
      </ViewHeader>
      <div className="rounded bg-panel p-4 pt-2.5">
        <form
          className="grid grid-cols-1"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <div className="mb-4">
            <label className="mb-1 block" htmlFor="email">Email address</label>
            <input type="email" placeholder="example@gmail.com" required name="email" id="email" className="input" />
            <span className="text-xs text-faint">Your email address to send the new password</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-accent">Send new password</button>
            <Link to="/" className="btn btn-default">Cancel</Link>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
