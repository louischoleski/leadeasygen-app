import { X } from '@phosphor-icons/react'
import { Button } from './Button'
import { Card } from './Card'
import { DialogShell } from './DialogShell'

interface CancelPlanDialogProps {
  open: boolean
  planName: string
  /** End of the already-paid billing period — access runs until then. */
  periodEnd: string
  /** What this plan has that the fallback (free) tier doesn't. */
  lostFeatures: string[]
  /** One line describing where the user lands after the period ends. */
  fallbackNote: string
  onConfirm: () => void
  onClose: () => void
}

/**
 * Cancellation is period-end, never mid-period: the user already paid for
 * the current period, so the dialog leads with what they keep (access until
 * the paid-through date) before listing what lapses afterwards.
 */
export function CancelPlanDialog({
  open,
  planName,
  periodEnd,
  lostFeatures,
  fallbackNote,
  onConfirm,
  onClose,
}: CancelPlanDialogProps) {
  return (
    <DialogShell open={open} labelledBy="cancel-plan-title" onClose={onClose} wide>
      <Card className="p-6">
        <h2 id="cancel-plan-title" className="text-card-title text-ink">
          Cancel your {planName} plan?
        </h2>
        <p className="mt-2 text-sm text-ink-subtle">
          Cancelling stops recurring billing. You've already paid for this period, so {planName}{' '}
          stays fully active until <span className="font-medium text-ink">{periodEnd}</span>.
        </p>

        <p className="mt-5 text-sm font-medium text-ink">After that, you'll lose access to</p>
        <ul className="mt-2 space-y-1.5">
          {lostFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-ink-subtle">
              <X className="h-4 w-4 shrink-0 text-error/70" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-subtle">{fallbackNote}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} autoFocus>
            Keep my {planName} plan
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Cancel plan
          </Button>
        </div>
      </Card>
    </DialogShell>
  )
}
