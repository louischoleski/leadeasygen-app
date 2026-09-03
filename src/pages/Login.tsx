import { LockOpen } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { Input } from '../components/Input'
import ViewHeader from '../components/ViewHeader'

export default function Login() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <ViewHeader icon={LockOpen} title="Login">
        Please enter your credentials to login.
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
            label="Username"
            id="username"
            name="username"
            placeholder="example@gmail.com"
            required
            helperText="Your unique username to app"
            containerClassName="mb-4"
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="******"
            required
            helperText="Your strong password"
            containerClassName="mb-4"
          />
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">Login</button>
            <Link to="/register" className="btn btn-secondary">Register</Link>
            <Link to="/forgot-password" className="text-xs text-link hover:underline">Forgot password?</Link>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
