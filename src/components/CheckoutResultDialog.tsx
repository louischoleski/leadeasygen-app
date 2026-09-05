import { CheckCircle, XCircle } from '@phosphor-icons/react'
import { Button } from './Button'
import { Card } from './Card'
import { DialogShell } from './DialogShell'

export type CheckoutResult = { status: 'success'; credits: number } | { status: 'cancelled' }

interface CheckoutResultDialogProps {
  result: CheckoutResult | null
  balance: number
  onClose: () => void
}

/** Modal receipt for a finished checkout, shown over the billing page. */
export function CheckoutResultDialog({ result, balance, onClose }: CheckoutResultDialogProps) {
  const success = result?.status === 'success'

  return (
    <DialogShell open={result !== null} labelledBy="checkout-result-title" onClose={onClose}>
      <Card className="p-6 text-center">
        {success ? (
          <CheckCircle
            className="mx-auto mb-3 h-10 w-10 text-success motion-reduce:animate-none animate-icon-pop"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            className="mx-auto mb-3 h-10 w-10 text-ink-subtle motion-reduce:animate-none animate-icon-pop"
            aria-hidden="true"
          />
        )}
        <h2 id="checkout-result-title" className="text-card-title text-ink">
          {success ? 'Payment successful' : 'Payment cancelled'}
        </h2>
        <p className="mt-1 text-sm text-ink-subtle">
          {success && result
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
    </DialogShell>
  )
}
