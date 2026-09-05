import { Check, Coin, CreditCard, Crown, Download, Plus, Receipt } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CheckoutResultDialog, type CheckoutResult } from '../components/CheckoutResultDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { CurrentPlanCard } from '../components/CurrentPlanCard'
import { IconButton } from '../components/IconButton'
import { Tabs } from '../components/Tabs'
import { Toggle } from '../components/Toggle'
import {
  addCredits,
  billingHistory,
  CHECKOUT_DONE_KEY,
  CHECKOUT_INTENT_KEY,
  creditPacks,
  subscriptionTiers,
  useBilling,
  type BillingRecord,
  type LedgerEntryType,
  type SubscriptionTier,
} from '../data/billing'
import { useJobs } from '../data/jobs'
import { cn } from '../lib/cn'

const statusBadge: Record<BillingRecord['status'], { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-success/10 text-success' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
  failed: { label: 'Failed', className: 'bg-error/10 text-error' },
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function CreditPacks() {
  const [, setSearchParams] = useSearchParams()
  const { subscriptionTier } = useBilling()
  const tier = subscriptionTiers.find((t) => t.id === subscriptionTier)
  // A paid plan includes unlimited credits — selling packs on top of it
  // would charge for something the subscription already covers.
  const hasPaidPlan = !!tier && tier.priceMonthly > 0

  return (
    <section id="packages" className="scroll-mt-20 space-y-4">
      {hasPaidPlan && (
        <p className="rounded-lg border border-hairline bg-surface-2/50 px-4 py-3 text-sm text-ink-subtle">
          Your {tier.name} plan already includes unlimited credits, so credit packs are unavailable
          while it's active.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {creditPacks.map((pkg) => (
          <Card key={pkg.id} className={cn('relative p-6', pkg.popular && 'border-primary shadow-sm')}>
            {pkg.popular && (
              <span className="absolute -top-2 right-4 rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-on-primary">
                Best Value
              </span>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-ink">{pkg.name}</h3>
              <p className="text-sm text-ink-subtle">{pkg.credits.toLocaleString()} credits</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-ink">${pkg.price}</span>
              <span className="text-ink-subtle"> one-time</span>
            </div>
            <p className="mb-6 text-sm text-ink-subtle">~{Math.round(pkg.credits / 20)} jobs at avg. cost</p>
            <Button
              fullWidth
              variant={pkg.popular ? 'primary' : 'secondary'}
              disabled={hasPaidPlan}
              onClick={() => {
                // Stands in for the Stripe redirect: flag the intent, land back
                // on the billing page with the checkout result in the query
                try {
                  sessionStorage.setItem(CHECKOUT_INTENT_KEY, pkg.id)
                } catch {
                  // storage unavailable: the result dialog simply won't show
                }
                setSearchParams({ checkout: 'success', pack: pkg.id })
              }}
            >
              Buy {pkg.name}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

function BillingHistoryTable() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-hairline bg-surface-2">
              {['Invoice', 'Date', 'Type', 'Description', 'Amount', 'Status'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-10 px-4 text-left text-xs font-medium tracking-wider text-ink-subtle uppercase"
                >
                  {heading}
                </th>
              ))}
              <th
                scope="col"
                className="h-10 px-4 text-right text-xs font-medium tracking-wider text-ink-subtle uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((record) => (
              <tr
                key={record.id}
                className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
              >
                <td className="p-4 font-medium text-ink">{record.id}</td>
                <td className="p-4 text-ink-subtle">{record.date}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                      record.type === 'subscription' ? 'bg-primary/10 text-link' : 'bg-surface-2 text-ink-subtle',
                    )}
                  >
                    {record.type === 'subscription' ? 'Subscription' : 'Credits'}
                  </span>
                </td>
                <td className="p-4 text-ink">{record.description}</td>
                <td className="p-4 font-medium text-ink">{record.amount}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                      statusBadge[record.status].className,
                    )}
                  >
                    {statusBadge[record.status].label}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      icon={Download}
                      variant="ghost"
                      size="sm"
                      aria-label={`Download ${record.id}`}
                      onClick={() => toast('Invoice downloads are not wired up yet')}
                    />
                    <IconButton
                      icon={Receipt}
                      variant="ghost"
                      size="sm"
                      aria-label={`View ${record.id}`}
                      onClick={() => toast('Invoice viewer is not wired up yet')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Keys are the credits-service wire types; labels stay our copy
const ledgerBadge: Record<LedgerEntryType, { label: string; className: string }> = {
  purchase: { label: 'Purchase', className: 'bg-primary/10 text-link' },
  usage: { label: 'Spend', className: 'bg-surface-2 text-ink-subtle' },
  refund: { label: 'Refund', className: 'bg-success/10 text-success' },
  bonus: { label: 'Grant', className: 'bg-success/10 text-success' },
}

const ledgerDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function CreditActivityTable() {
  const { ledger } = useBilling()

  if (ledger.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Coin className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
        <p className="text-ink-subtle">No credit activity yet.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-hairline bg-surface-2">
              {['Date', 'Description', 'Type'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-10 px-4 text-left text-xs font-medium tracking-wider text-ink-subtle uppercase"
                >
                  {heading}
                </th>
              ))}
              {['Amount', 'Balance'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-10 px-4 text-right text-xs font-medium tracking-wider text-ink-subtle uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
              >
                <td className="p-4 text-ink-subtle">{ledgerDate(entry.date)}</td>
                <td className="p-4 text-ink">{entry.description}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                      ledgerBadge[entry.type].className,
                    )}
                  >
                    {ledgerBadge[entry.type].label}
                  </span>
                </td>
                <td
                  className={cn(
                    'p-4 text-right font-medium',
                    entry.amount > 0 ? 'text-success' : 'text-ink',
                  )}
                >
                  {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                </td>
                <td className="p-4 text-right font-medium text-ink">{entry.balanceAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function SubscriptionPlans() {
  const { billingCycle, setBillingCycle, subscriptionTier, setSubscription } = useBilling()
  const [confirmingDowngrade, setConfirmingDowngrade] = useState(false)

  const choose = (tier: SubscriptionTier) => {
    if (tier.id === 'free') {
      setConfirmingDowngrade(true)
      return
    }
    setSubscription(tier.id)
    toast.success(`Subscribed to ${tier.name}`, { description: 'Demo mode — no payment processed.' })
  }

  return (
    <section id="plans" className="scroll-mt-20 space-y-4">
      <div className="flex justify-center pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface-2 p-1">
          <button
            type="button"
            aria-pressed={billingCycle === 'monthly'}
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-all',
              billingCycle === 'monthly' ? 'bg-surface-1 text-ink shadow-sm' : 'text-ink-subtle hover:text-ink',
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billingCycle === 'annual'}
            onClick={() => setBillingCycle('annual')}
            className={cn(
              'inline-flex cursor-pointer items-center rounded-md px-4 py-1.5 text-sm font-medium transition-all',
              billingCycle === 'annual' ? 'bg-surface-1 text-ink shadow-sm' : 'text-ink-subtle hover:text-ink',
            )}
          >
            Annual
            <span className="ml-1.5 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-semibold text-success">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {subscriptionTiers.map((tier) => {
          const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceAnnual
          const current = tier.id === subscriptionTier
          return (
            <Card
              key={tier.id}
              className={cn('relative flex flex-col p-6', tier.popular && 'border-primary bg-surface-2/50 shadow-sm')}
            >
              {tier.popular && (
                <span className="absolute -top-2 right-4 rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-on-primary shadow">
                  Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
                <p className="text-sm text-ink-subtle">{tier.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-ink">${price}</span>
                <span className="text-ink-subtle">/{billingCycle === 'monthly' ? 'mo' : 'mo, billed annually'}</span>
              </div>
              <ul className="mb-6 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="h-4 w-4 shrink-0 text-success" weight="bold" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {current ? (
                  <Button variant="secondary" fullWidth disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={tier.id !== 'free' && tier.popular ? 'primary' : 'secondary'}
                    fullWidth
                    onClick={() => choose(tier)}
                  >
                    {tier.id === 'free' ? 'Downgrade' : 'Subscribe'}
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={confirmingDowngrade}
        title="Downgrade to Free?"
        description="You'll lose unlimited jobs and credits, and Free-tier limits apply immediately."
        confirmLabel="Downgrade"
        danger
        onConfirm={() => {
          setConfirmingDowngrade(false)
          setSubscription('free')
          toast.success('Switched to the Free plan', { description: 'Demo mode — no payment processed.' })
        }}
        onClose={() => setConfirmingDowngrade(false)}
      />
    </section>
  )
}

export default function Billing() {
  const { creditBalance, subscriptionTier, billingCycle, usage } = useBilling()
  const { activeJobs } = useJobs()
  const [showSubscription, setShowSubscription] = useState(false)
  const [activeTab, setActiveTab] = useState('history')
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null)
  const checkoutConsumed = useRef(false)

  // A finished checkout lands here as ?checkout=success|cancelled (set by the
  // buy button today; a real Stripe redirect URL later). Consume the intent
  // exactly once, credit the pack, and show the receipt as a modal.
  useEffect(() => {
    const status = searchParams.get('checkout')
    if (!status) {
      checkoutConsumed.current = false
      return
    }
    if (status === 'cancelled') {
      setCheckoutResult({ status: 'cancelled' })
      return
    }
    if (status !== 'success' || checkoutConsumed.current) return
    checkoutConsumed.current = true

    const pack = creditPacks.find((p) => p.id === searchParams.get('pack'))
    const dismiss = () => setSearchParams({}, { replace: true })
    if (!pack) return dismiss()
    try {
      const intent = sessionStorage.getItem(CHECKOUT_INTENT_KEY)
      const done = sessionStorage.getItem(CHECKOUT_DONE_KEY)
      if (intent === pack.id) {
        sessionStorage.removeItem(CHECKOUT_INTENT_KEY)
        sessionStorage.setItem(CHECKOUT_DONE_KEY, pack.id)
        addCredits(pack.credits, `${pack.name} — ${pack.credits} credits`)
        setCheckoutResult({ status: 'success', credits: pack.credits })
      } else if (done === pack.id) {
        // Refresh of an already-processed checkout: re-show the receipt, no re-credit
        setCheckoutResult({ status: 'success', credits: pack.credits })
      } else {
        dismiss() // stale or shared link: nothing to show
      }
    } catch {
      dismiss()
    }
  }, [searchParams, setSearchParams])

  const closeCheckoutDialog = () => {
    setCheckoutResult(null)
    setSearchParams({}, { replace: true })
  }
  const payAsYouGo = subscriptionTier === null || subscriptionTier === 'free'
  // Card is always shown; a null subscription displays under the free tier's limits
  const activeTier = subscriptionTiers.find((tier) => tier.id === subscriptionTier) ?? subscriptionTiers[0]

  const showPackages = () => {
    setShowSubscription(false)
    requestAnimationFrame(() => scrollTo('packages'))
  }
  const showPlans = () => {
    setShowSubscription(true)
    requestAnimationFrame(() => scrollTo('plans'))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Billing</h1>
        <p className="text-ink-subtle">Manage your credits and subscription.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Coin className="h-7 w-7 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-ink-subtle">Available Credits</p>
              <p className="text-4xl font-bold tracking-tight text-ink">{creditBalance}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button iconLeft={Plus} onClick={showPackages}>
              Buy Credits
            </Button>
            <Button variant="secondary" iconLeft={Crown} onClick={showPlans}>
              View Plans
            </Button>
          </div>
        </div>
        {payAsYouGo && (
          <div className="border-t border-hairline bg-surface-2/50 px-6 py-3">
            <p className="text-sm text-ink-subtle">
              You're on pay-as-you-go.{' '}
              <button type="button" onClick={showPlans} className="cursor-pointer text-link underline">
                Subscribe for unlimited
              </button>
            </p>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CurrentPlanCard
            planName={activeTier.name}
            billingCycle={billingCycle}
            nextBillingDate="June 1, 2025"
            metrics={[
              { label: 'Active jobs', used: activeJobs.length, total: activeTier.limits.activeJobs },
              { label: 'Credits this month', used: usage.creditsUsed, total: activeTier.limits.creditsPerMonth },
            ]}
            onCancel={activeTier.id !== 'free' ? () => setConfirmingCancel(true) : undefined}
          />
          <ConfirmDialog
            open={confirmingCancel}
            title="Cancel subscription?"
            description={`Your ${activeTier.name} plan stays active until the end of the billing period, then you move to the Free tier.`}
            confirmLabel="Cancel subscription"
            danger
            onConfirm={() => {
              setConfirmingCancel(false)
              toast('Cancel subscription — Demo mode, no action taken')
            }}
            onClose={() => setConfirmingCancel(false)}
          />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                {showSubscription ? 'Subscription Plans' : 'Credit Packs'}
              </h2>
              <p className="text-sm text-ink-subtle">
                {showSubscription ? 'Recurring plans for unlimited scraping' : 'One-time purchases, never expire'}
              </p>
            </div>
            <Toggle
              pressed={showSubscription}
              onPressedChange={setShowSubscription}
              unpressedLabel="Buy Credits"
              pressedLabel="Subscribe"
              aria-label="Choose billing mode"
            />
          </div>
          {showSubscription ? <SubscriptionPlans /> : <CreditPacks />}
        </div>
      </div>

      <div>
        <Tabs
          tabs={[
            { id: 'history', label: 'Billing History' },
            { id: 'activity', label: 'Credit Activity' },
            { id: 'methods', label: 'Payment Methods' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-2">
          {activeTab === 'history' && <BillingHistoryTable />}
          {activeTab === 'activity' && <CreditActivityTable />}
          {activeTab === 'methods' && (
            <Card className="p-12 text-center">
              <CreditCard className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
              <p className="text-ink-subtle">No payment methods on file.</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => toast('Payment methods are not wired up yet')}
              >
                Add Payment Method
              </Button>
            </Card>
          )}
        </div>
      </div>

      <CheckoutResultDialog result={checkoutResult} balance={creditBalance} onClose={closeCheckoutDialog} />
    </div>
  )
}
