import { useSavePaymentMethod, useSetupPaymentMethod } from '@fonderie/react-billing'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { getStripe } from '../lib/stripe'
import { Button } from './Button'

// The card form itself — mounted INSIDE <Elements> so useStripe()/useElements()
// resolve. Confirms the SetupIntent in-page (redirect: 'if_required' keeps the
// user on the site for cards that need no 3DS), then records the resulting
// payment method server-side.
function CardForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const { save, isLoading: saving } = useSavePaymentMethod()
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    try {
      const { error, setupIntent } = await stripe.confirmSetup({ elements, redirect: 'if_required' })
      if (error) {
        toast.error(error.message ?? 'Could not save the card.')
        return
      }
      const pm =
        typeof setupIntent?.payment_method === 'string'
          ? setupIntent.payment_method
          : (setupIntent?.payment_method?.id ?? null)
      if (!pm) {
        toast.error('Card confirmation did not return a payment method.')
        return
      }
      await save(pm)
      toast.success('Card saved')
      onSaved()
    } catch {
      toast.error('Could not save the card. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting || saving
  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement />
      <div className="flex gap-3">
        <Button type="submit" disabled={!stripe || busy}>
          {busy ? 'Saving…' : 'Save card'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Kicks off the SetupIntent, then mounts the embedded Payment Element with its
// client secret. The user never leaves the site.
export function AddPaymentMethod({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const { setup, isLoading, error } = useSetupPaymentMethod()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const stripePromise = getStripe()

  useEffect(() => {
    let live = true
    void setup()
      .then((secret) => {
        if (live) setClientSecret(secret)
      })
      .catch(() => {
        /* surfaced via `error` below */
      })
    return () => {
      live = false
    }
  }, [setup])

  if (!stripePromise) {
    return (
      <p className="text-sm text-ink-subtle">
        In-app card entry is unavailable — set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to enable it.
      </p>
    )
  }
  if (error) {
    return <p className="text-sm text-ink-subtle">Could not start card setup. Please try again.</p>
  }
  if (isLoading || !clientSecret) {
    return <p className="text-sm text-ink-subtle">Preparing secure card form…</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CardForm onSaved={onSaved} onCancel={onCancel} />
    </Elements>
  )
}
