import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export default function VerifyEmail() {
  const navigate = useNavigate()

  return (
    <AuthCard title="Verify your email" subtitle="We've sent a code to your email. Enter it below.">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          toast.success('Email verified')
          navigate('/')
        }}
      >
        <Input
          label="Verification code"
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          containerClassName="mb-6"
          className="text-center text-lg tracking-[0.5em]"
        />
        <Button type="submit" fullWidth>Verify</Button>
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
