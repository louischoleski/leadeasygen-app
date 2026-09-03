import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { OtpInput } from '../components/OtpInput'

const CODE_LENGTH = 6

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

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
        <div className="mb-6">
          <p id="otp-label" className="mb-1.5 text-sm font-medium text-ink">Verification code</p>
          <OtpInput value={code} onChange={setCode} length={CODE_LENGTH} aria-labelledby="otp-label" />
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
