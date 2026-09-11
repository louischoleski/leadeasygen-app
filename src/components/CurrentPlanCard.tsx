import { Calendar, Check } from '@phosphor-icons/react'
import type { BillingCycle } from '../data/billing'
import { useTranslation } from '../hooks/useTranslation'
import { Button } from './Button'
import { Card } from './Card'
import { UsageBar } from './UsageBar'

export interface UsageMetric {
  label: string
  used: number
  total: number | null // null = unlimited
  unit?: string
  // 'usage' (default): `used` of `total` consumed — fuller = worse (red near cap).
  // 'remaining': `used` is what's LEFT of `total` — fuller = better (red near empty),
  // for a use-it-or-lose-it allowance where "how much is left" is the useful read.
  mode?: 'usage' | 'remaining'
}

interface CurrentPlanCardProps {
  planName: string
  billingCycle: BillingCycle
  nextBillingDate: string
  // Overrides the date-box label. Free plans aren't billed, so they pass
  // "Credits reset" (with the allowance renewal date) instead of the default
  // "Next billing date".
  dateLabel?: string
  metrics: UsageMetric[]
  // Pack credits on top of the plan allowance — a separate, never-expiring
  // bucket. Shown as its own bar so it never inflates the monthly-usage metric.
  purchasedCredits?: number
  onCancel?: () => void // omit when there is nothing to cancel (free tier / already scheduled)
  scheduledToCancel?: boolean // subscription is set to cancel at period end
  onResume?: () => void // un-cancel a scheduled cancellation (shown instead of Cancel)
  resuming?: boolean // reactivate request in flight
}

function MetricRow({ label, used, total, unit, mode = 'usage' }: UsageMetric) {
  const { t } = useTranslation()
  if (total === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <p className="text-ink-subtle">{label}</p>
        <div className="flex items-center gap-1.5 font-medium text-success">
          <Check className="h-4 w-4" weight="bold" aria-hidden="true" />
          <span>{t('billing.plan.unlimited')}</span>
        </div>
      </div>
    )
  }

  if (mode === 'remaining') {
    // `used` is what's LEFT. Fuller bar = more remaining = good; warn as it runs low.
    // The allowance can legitimately exceed the plan's per-period amount — credits
    // granted before a grant-config shrink stay valid until they expire — and
    // clamping would peg the meter at "total / total left" no matter how much the
    // user spends. Show the real count, minus the now-meaningless denominator.
    if (used > total) {
      return (
        <UsageBar
          label={label}
          used={used}
          total={used}
          status="success"
          valueText={t('billing.plan.left', { count: used })}
        />
      )
    }
    const remaining = Math.max(0, used)
    const pct = total > 0 ? (remaining / total) * 100 : 0
    const status = pct > 50 ? 'success' : pct > 20 ? 'warning' : 'error'
    return (
      <UsageBar
        label={label}
        used={remaining}
        total={total}
        status={status}
        valueText={`${t('billing.plan.leftOf', { used: remaining, total })}${unit ? ` ${unit}` : ''}`}
      />
    )
  }

  // usage: red only when genuinely over the limit; at-limit reads as warning
  const pct = (used / total) * 100
  const status = pct > 100 ? 'error' : pct > 50 ? 'warning' : 'success'
  return <UsageBar label={label} used={used} total={total} suffix={unit} status={status} />
}

export function CurrentPlanCard({
  planName,
  billingCycle,
  nextBillingDate,
  dateLabel,
  metrics,
  purchasedCredits = 0,
  onCancel,
  scheduledToCancel = false,
  onResume,
  resuming = false,
}: CurrentPlanCardProps) {
  const { t } = useTranslation()
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{planName}</h2>
          <p className="text-sm text-ink-subtle capitalize">{t(`billing.plan.cycle.${billingCycle}`)}</p>
        </div>
        {scheduledToCancel ? (
          <span className="inline-flex items-center rounded-md bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            {t('billing.plan.cancelsAtPeriodEnd')}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
            {t('billing.plan.active')}
          </span>
        )}
      </div>

      <div className="p-6 pt-4">
        <div className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
          <div className="text-sm">
            <p className="font-medium text-ink">
              {dateLabel ?? (scheduledToCancel ? t('billing.plan.accessUntil') : t('billing.plan.nextBillingDate'))}
            </p>
            <p className="text-ink-subtle">{nextBillingDate}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm font-medium text-ink">{t('billing.plan.usage')}</p>
        {metrics.map((metric) => (
          <MetricRow key={metric.label} {...metric} />
        ))}
        {purchasedCredits > 0 && (
          // Purchased credits never expire and don't count against the monthly
          // allowance — a full bar communicates "all available".
          <UsageBar
            label={t('billing.plan.purchasedCredits')}
            used={purchasedCredits}
            total={purchasedCredits}
            status="success"
            valueText={t('billing.plan.available', { count: purchasedCredits })}
          />
        )}
      </div>

      {scheduledToCancel && onResume ? (
        <div className="mt-auto px-6 pb-6">
          <Button fullWidth onClick={onResume} disabled={resuming}>
            {resuming ? t('billing.plan.resuming') : t('billing.plan.resume')}
          </Button>
        </div>
      ) : onCancel ? (
        <div className="mt-auto px-6 pb-6">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {t('billing.plan.cancel')}
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
