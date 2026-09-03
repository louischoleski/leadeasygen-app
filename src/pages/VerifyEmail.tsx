import { EnvelopeSimple } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import ViewHeader from '../components/ViewHeader'

export default function VerifyEmail() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <ViewHeader icon={EnvelopeSimple} title="Verify your email">
        We sent a 6-digit code to your email address.
      </ViewHeader>
      <div className="card p-6">
        <form
          className="grid grid-cols-1"
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
            helperText="The code expires after 10 minutes"
            containerClassName="mb-4"
            className="text-center text-lg tracking-[0.5em]"
          />
          <div className="flex items-center gap-2">
            <Button type="submit">Verify</Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => toast('Verification code sent', { description: 'Check your inbox.' })}
            >
              Resend code
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
