import { CheckCircle, XCircle } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { Button } from './Button'
import { Card } from './Card'

export type CheckoutResult = { status: 'success'; credits: number } | { status: 'cancelled' }

interface CheckoutResultDialogProps {
  result: CheckoutResult | null
  balance: number
  onClose: () => void
}

/** Modal receipt for a finished checkout, shown over the billing page. */
export function CheckoutResultDialog({ result, balance, onClose }: CheckoutResultDialogProps) {
  // Focus returns to whatever opened the dialog once it closes
  const restoreRef = useRef<HTMLElement | null>(null)
  const open = result !== null

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    return () => restoreRef.current?.focus()
  }, [open])

  if (!result) return null
  const success = result.status === 'success'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-overlay/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-result-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2"
      >
        <Card className="p-6 text-center">
          {success ? (
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-success" aria-hidden="true" />
          ) : (
            <XCircle className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
          )}
          <h2 id="checkout-result-title" className="text-card-title text-ink">
            {success ? 'Payment successful' : 'Payment cancelled'}
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">
            {success
              ? `+${result.credits.toLocaleString()} credits added to your balance.`
              : "You weren't charged — your balance is unchanged."}
          </p>
          {success && (
            <>
              <div className="mt-5 rounded-lg bg-surface-2 p-4">
                <p className="text-sm text-ink-subtle">New balance</p>
                <p className="text-3xl font-bold text-ink">{balance.toLocaleString()}</p>
              </div>
              <p className="mt-3 text-xs text-ink-subtle">Demo checkout — no payment was processed.</p>
            </>
          )}
          <Button fullWidth className="mt-6" onClick={onClose} autoFocus>
            {success ? 'Done' : 'Close'}
          </Button>
        </Card>
      </div>
    </>
  )
}
