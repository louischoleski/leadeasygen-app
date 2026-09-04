import { useVerifyEmail } from '@fonderie/react-auth'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { OtpInput } from '../components/OtpInput'
import { applyAuthError } from '../lib/authErrors'
import { useAppSession } from '../lib/session'

const CODE_LENGTH = 6

interface VerifyValues {
  code: string
}

export default function VerifyEmail() {
  const navigate = useNavigate()
  const { verifyEmail, resend, resent, isLoading } = useVerifyEmail()
  const { refresh } = useAppSession()

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<VerifyValues>({ defaultValues: { code: '' } })
  const code = watch('code')

  const onSubmit = async ({ code }: VerifyValues) => {
    try {
      await verifyEmail(code)
      await refresh({ force: true })
      toast.success('Email verified')
      navigate('/')
    } catch (err) {
      applyAuthError(
        err,
        setError,
        { VERIFICATION_FAILED: 'code', token: 'code' },
        'Verification failed',
      )
    }
  }

  const handleResend = async () => {
    try {
      await resend()
      toast('Verification code sent', { description: 'Check your inbox.' })
    } catch (err) {
      applyAuthError(err, setError, {}, 'Could not resend the code — are you logged in?')
    }
  }

  return (
    <AuthCard title="Verify your email" subtitle="We've sent a code to your email. Enter it below.">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <p id="otp-label" className="mb-1.5 text-sm font-medium text-ink">Verification code</p>
          <Controller
            control={control}
            name="code"
            rules={{ validate: (value) => value.length === CODE_LENGTH || 'Enter the 6-digit code' }}
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                length={CODE_LENGTH}
                aria-labelledby="otp-label"
              />
            )}
          />
          {errors.code && <p className="mt-1.5 text-center text-xs text-error">{errors.code.message}</p>}
          <p className="mt-1.5 text-center text-xs text-ink-subtle">The code expires after 10 minutes</p>
        </div>
        <Button type="submit" fullWidth loading={isLoading} disabled={code.length !== CODE_LENGTH}>
          Verify
        </Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Didn't receive a code?{' '}
          <Button variant="link" type="button" onClick={() => void handleResend()} disabled={resent}>
            {resent ? 'Code sent' : 'Resend'}
          </Button>
        </p>
      </form>
    </AuthCard>
  )
}
