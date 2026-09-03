import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { OtpInput } from '../components/OtpInput'

const CODE_LENGTH = 6

interface VerifyValues {
  code: string
}

export default function VerifyEmail() {
  const navigate = useNavigate()

  const { control, handleSubmit, watch } = useForm<VerifyValues>({ defaultValues: { code: '' } })
  const code = watch('code')

  const onSubmit = () => {
    toast.success('Email verified')
    navigate('/')
  }

  return (
    <AuthCard title="Verify your email" subtitle="We've sent a code to your email. Enter it below.">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <p id="otp-label" className="mb-1.5 text-sm font-medium text-ink">Verification code</p>
          <Controller
            control={control}
            name="code"
            rules={{ validate: (value) => value.length === CODE_LENGTH }}
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                length={CODE_LENGTH}
                aria-labelledby="otp-label"
              />
            )}
          />
          <p className="mt-1.5 text-center text-xs text-ink-subtle">The code expires after 10 minutes</p>
        </div>
        <Button type="submit" fullWidth disabled={code.length !== CODE_LENGTH}>
          Verify
        </Button>
        <p className="mt-4 text-center text-sm text-ink-subtle">
          Didn't receive a code?{' '}
          <Button
            variant="link"
            type="button"
            onClick={() => toast('Verification code sent', { description: 'Check your inbox.' })}
          >
            Resend
          </Button>
        </p>
      </form>
    </AuthCard>
  )
}
