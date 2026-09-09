import { useCallback, useState } from 'react'
import { useInvoices } from '@fonderie/react-billing'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { isRecentDuplicate } from './recentDuplicate'

export interface PurchaseIntent {
  // Charge amount in the smallest currency unit (cents), used to match a
  // recent invoice of the same product.
  amountCents: number
  // Human label for the confirmation copy, e.g. "the Unlimited plan" / "the
  // 100-credit pack".
  label: string
}

// One reusable gate for every paid action (subscribe + buy pack). `confirm`
// resolves true when it's safe to proceed: immediately when there's no recent
// matching purchase, or after the user confirms the "you already bought this"
// dialog. Render `dialog` once in the component. Backed by the invoice history
// the app already loads — no extra state to maintain.
export function useDuplicatePurchaseGuard() {
  const { invoices } = useInvoices()
  const [pending, setPending] = useState<{ label: string; resolve: (ok: boolean) => void } | null>(null)

  const confirm = useCallback(
    (intent: PurchaseIntent): Promise<boolean> => {
      if (!isRecentDuplicate(invoices, intent.amountCents, Date.now())) return Promise.resolve(true)
      // Ask before charging again — resolved by the dialog buttons below.
      return new Promise((resolve) => setPending({ label: intent.label, resolve }))
    },
    [invoices],
  )

  const settle = (ok: boolean) => {
    pending?.resolve(ok)
    setPending(null)
  }

  const dialog = (
    <ConfirmDialog
      open={pending !== null}
      title="Purchase this again?"
      description={`You already purchased ${pending?.label ?? 'this'} in the last few minutes. Are you sure you want to purchase it again?`}
      confirmLabel="Yes, purchase again"
      cancelLabel="Cancel"
      onConfirm={() => settle(true)}
      onClose={() => settle(false)}
    />
  )

  return { confirm, dialog }
}
