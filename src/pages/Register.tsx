import { UserPlus } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { Input } from '../components/Input'
import ViewHeader from '../components/ViewHeader'

const fields = [
  { id: 'username', label: 'Username', type: 'text', hint: 'Your unique username to app' },
  { id: 'password', label: 'Password', type: 'password', hint: 'Your hard to guess password' },
  { id: 'repeatPassword', label: 'Repeat Password', type: 'password', hint: 'Please repeat your password' },
  { id: 'email', label: 'Email Address', type: 'email', hint: 'Your email address to contact' },
] as const

export default function Register() {
  const navigate = useNavigate()

  return (
    <AuthCard wide>
      <ViewHeader icon={UserPlus} title="Register">
        Please enter your data to register.
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
          <div className="grid gap-x-8 lg:grid-cols-2">
            {fields.map((field) => (
              <Input
                key={field.id}
                label={field.label}
                id={field.id}
                name={field.id}
                type={field.type}
                required
                helperText={field.hint}
                containerClassName="mb-4"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">Register</button>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
