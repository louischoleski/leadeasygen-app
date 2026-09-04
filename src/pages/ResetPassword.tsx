import { useResetPassword } from '@fonderie/react-auth'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { OtpInput } from '../components/OtpInput'
import { applyAuthError } from '../lib/authErrors'

const PIN_LENGTH = 6

interface ResetValues {
  pin: string
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const { resetPassword, isLoading } = useResetPassword()

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    control,
    formState: { errors },
  } = useForm<ResetValues>({ defaultValues: { pin: '' } })

  const onSubmit = async ({ pin, password }: ResetValues) => {
    try {
      await resetPassword({ pin, password })
      toast.success('Password updated. Please log in with your new password.')
      navigate('/login')
    } catch (err) {
      applyAuthError(
        err,
        setError,
        { PASSWORD_RESET_FAILED: 'pin', pin: 'pin', password: 'password' },
        'Could not reset the password',
      )
    }
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter the 6-digit code we emailed you and choose a new password">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <p id="pin-label" className="mb-1.5 text-sm font-medium text-ink">Reset code</p>
          <Controller
            control={control}
            name="pin"
            rules={{ validate: (value) => value.length === PIN_LENGTH || 'Enter the 6-digit code' }}
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                length={PIN_LENGTH}
                aria-labelledby="pin-label"
              />
            )}
          />
          {errors.pin && <p className="mt-1.5 text-center text-xs text-error">{errors.pin.message}</p>}
        </div>
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
        <Button type="submit" fullWidth loading={isLoading}>Reset password</Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          <Link to="/login" className="text-link underline">Back to login</Link>
        </p>
      </form>
    </AuthCard>
  )
}
