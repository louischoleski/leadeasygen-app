import { EnvelopeSimple } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthCard from '../components/AuthCard'
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
          <div className="mb-4">
            <label className="mb-1 block font-medium text-ink" htmlFor="code">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              name="code"
              id="code"
              className="input text-center text-lg tracking-[0.5em]"
            />
            <span className="text-xs text-ink-subtle">The code expires after 10 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">Verify</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toast('Verification code sent', { description: 'Check your inbox.' })}
            >
              Resend code
            </button>
          </div>
        </form>
      </div>
    </AuthCard>
  )
}
