import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

interface ResetValues {
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetValues>()

  const onSubmit = () => {
    toast.success('Password updated. Please log in with your new password.')
    navigate('/login')
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter your new password below">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {!token && (
          <p className="mb-4 text-xs text-error">
            This link is missing its reset token. Request a new one from the forgot password page.
          </p>
        )}
        <Input
          label="New password"
          id="password"
          type="password"
          error={errors.password?.message}
          containerClassName="mb-4"
          {...register('password', {
            required: 'Enter a new password',
            minLength: { value: 8, message: 'Use at least 8 characters' },
          })}
        />
        <Input
          label="Confirm new password"
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          containerClassName="mb-6"
          {...register('confirmPassword', {
            required: 'Repeat your new password',
            validate: (value) => value === getValues('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" fullWidth>Reset password</Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          <Link to="/login" className="text-link underline">Back to login</Link>
        </p>
      </form>
    </AuthCard>
  )
}
