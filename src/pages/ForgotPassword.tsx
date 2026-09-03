import { IdentificationCard } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { Input } from '../components/Input'
import ViewHeader from '../components/ViewHeader'

export default function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <ViewHeader icon={IdentificationCard} title="Reset password">
        Please enter your email to reset your password.
      </ViewHeader>
      <div className="card p-6">
        <form
          className="grid grid-cols-1"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            required
            helperText="Your email address to send the new password"
            containerClassName="mb-4"
          />
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">Send new password</button>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
