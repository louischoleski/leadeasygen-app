import { LockOpen } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import ViewHeader from '../components/ViewHeader'

export default function Login() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <ViewHeader icon={LockOpen} title="Login">
        Please enter your credentials to login.
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
            <label className="mb-1 block" htmlFor="username">Username</label>
            <input type="text" placeholder="example@gmail.com" required name="username" id="username" className="input" />
            <span className="text-xs text-faint">Your unique username to app</span>
          </div>
          <div className="mb-4">
            <label className="mb-1 block" htmlFor="password">Password</label>
            <input type="password" placeholder="******" required name="password" id="password" className="input" />
            <span className="text-xs text-faint">Your strong password</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-accent">Login</button>
            <Link to="/register" className="btn btn-default">Register</Link>
            <Link to="/forgot-password" className="text-xs text-accent hover:text-warning">Forgot password?</Link>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
