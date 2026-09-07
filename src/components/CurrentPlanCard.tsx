import { Calendar, Check } from '@phosphor-icons/react'
import type { BillingCycle } from '../data/billing'
import { Button } from './Button'
import { Card } from './Card'
import { UsageBar } from './UsageBar'

export interface UsageMetric {
  label: string
  used: number
  total: number | null // null = unlimited
  unit?: string
}

interface CurrentPlanCardProps {
  planName: string
  billingCycle: BillingCycle
  nextBillingDate: string
  metrics: UsageMetric[]
  onCancel?: () => void // omit when there is nothing to cancel (free tier / already scheduled)
  scheduledToCancel?: boolean // subscription is set to cancel at period end
  onResume?: () => void // un-cancel a scheduled cancellation (shown instead of Cancel)
  resuming?: boolean // reactivate request in flight
}

function MetricRow({ label, used, total, unit }: UsageMetric) {
  if (total === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <p className="text-ink-subtle">{label}</p>
        <div className="flex items-center gap-1.5 font-medium text-success">
          <Check className="h-4 w-4" weight="bold" aria-hidden="true" />
          <span>Unlimited</span>
        </div>
      </div>
    )
  }

  // red only when genuinely over the limit; at-limit reads as warning
  const pct = (used / total) * 100
  const status = pct > 100 ? 'error' : pct > 50 ? 'warning' : 'success'
  return <UsageBar label={label} used={used} total={total} suffix={unit} status={status} />
}

export function CurrentPlanCard({
  planName,
  billingCycle,
  nextBillingDate,
  metrics,
  onCancel,
  scheduledToCancel = false,
  onResume,
  resuming = false,
}: CurrentPlanCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{planName}</h2>
          <p className="text-sm text-ink-subtle capitalize">{billingCycle} billing</p>
        </div>
        {scheduledToCancel ? (
          <span className="inline-flex items-center rounded-md bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            Cancels at period end
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
            Active
          </span>
        )}
      </div>

      <div className="p-6 pt-4">
        <div className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
          <div className="text-sm">
            <p className="font-medium text-ink">{scheduledToCancel ? 'Access until' : 'Next billing date'}</p>
            <p className="text-ink-subtle">{nextBillingDate}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm font-medium text-ink">Plan Usage</p>
        {metrics.map((metric) => (
          <MetricRow key={metric.label} {...metric} />
        ))}
      </div>

      {scheduledToCancel && onResume ? (
        <div className="mt-auto px-6 pb-6">
          <Button fullWidth onClick={onResume} disabled={resuming}>
            {resuming ? 'Resuming…' : 'Resume Subscription'}
          </Button>
        </div>
      ) : onCancel ? (
        <div className="mt-auto px-6 pb-6">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancel Subscription
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
