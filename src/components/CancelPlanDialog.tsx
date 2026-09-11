import { X } from '@phosphor-icons/react'
import { useTranslation } from '../hooks/useTranslation'
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
  /** Disable the confirm button while the cancellation request is in flight. */
  confirmDisabled?: boolean
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
  confirmDisabled = false,
}: CancelPlanDialogProps) {
  const { t } = useTranslation()
  return (
    <DialogShell open={open} labelledBy="cancel-plan-title" onClose={onClose} wide>
      <Card className="p-6">
        <h2 id="cancel-plan-title" className="text-card-title text-ink">
          {t('billing.cancelDialog.title', { plan: planName })}
        </h2>
        <p className="mt-2 text-sm text-ink-subtle">
          {t('billing.cancelDialog.body', { plan: planName })}{' '}
          <span className="font-medium text-ink">{periodEnd}</span>.
        </p>

        <p className="mt-5 text-sm font-medium text-ink">{t('billing.cancelDialog.loseAccess')}</p>
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
            {t('billing.cancelDialog.keep', { plan: planName })}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={confirmDisabled}>
            {t('billing.cancelDialog.confirm')}
          </Button>
        </div>
      </Card>
    </DialogShell>
  )
}
