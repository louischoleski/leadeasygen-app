import { Check, Coin, CreditCard, Crown, Download, Plus, Receipt } from '@phosphor-icons/react'
import {
  useCancelSubscription,
  useCheckout,
  useInvoices,
  usePaymentMethod,
  useReactivateSubscription,
  useSubscription,
  useWalletCheckout,
  useWalletTransactions,
  type IInvoiceDTO,
  type IWalletTransactionDTO,
} from '@fonderie/react-billing'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CancelPlanDialog } from '../components/CancelPlanDialog'
import { CurrentPlanCard } from '../components/CurrentPlanCard'
import { IconButton } from '../components/IconButton'
import { Tabs } from '../components/Tabs'
import { Toggle } from '../components/Toggle'
import {
  creditPacks,
  refreshBalance,
  refreshSubscription,
  subscriptionTiers,
  useBilling,
  type BillingCycle,
  type SubscriptionTier,
} from '../data/billing'
import { useJobs } from '../data/jobs'
import { cn } from '../lib/cn'

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// A money amount billing returns as a string in the smallest currency unit.
const money = (minor: string, currency: string) =>
  `${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(minor) / 100)}`

function CreditPacks() {
  const { subscriptionTier } = useBilling()
  const { checkout, isLoading } = useWalletCheckout()
  const tier = subscriptionTiers.find((t) => t.id === subscriptionTier)
  // A paid plan includes unlimited credits — selling packs on top of it would
  // charge for something the subscription already covers (G5: hide packs while
  // subscribed). Enforced server-side too once GAP-1 lands in billing.
  const hasPaidPlan = !!tier && tier.priceMonthly > 0

  const buy = async (packId: string) => {
    try {
      const url = await checkout({ packId })
      window.location.assign(url) // hosted Stripe checkout; the webhook credits the wallet
    } catch {
      toast.error('Could not start checkout. Please try again.')
    }
  }

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
              disabled={hasPaidPlan || isLoading}
              onClick={() => void buy(pkg.id)}
            >
              Buy {pkg.name}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

const invoiceStatusBadge = (status: string): { label: string; className: string } => {
  switch (status) {
    case 'paid':
      return { label: 'Paid', className: 'bg-success/10 text-success' }
    case 'open':
    case 'draft':
      return { label: status === 'open' ? 'Open' : 'Draft', className: 'bg-warning/10 text-warning' }
    default:
      return { label: status.charAt(0).toUpperCase() + status.slice(1), className: 'bg-error/10 text-error' }
  }
}

const invoiceDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// Subscription invoices from billing; each row links out to the provider-hosted
// invoice / PDF (Anthropic-style: the list lives in-app, the document on Stripe).
function InvoicesTable() {
  const { invoices, isLoading, error } = useInvoices()

  if (isLoading) {
    return <Card className="p-12 text-center text-ink-subtle">Loading invoices…</Card>
  }
  if (error) {
    return <Card className="p-12 text-center text-error">Couldn't load invoices.</Card>
  }
  if (invoices.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Receipt className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
        <p className="text-ink-subtle">No invoices yet.</p>
      </Card>
    )
  }

  const open = (inv: IInvoiceDTO, prefer: 'pdf' | 'hosted') => {
    const url = prefer === 'pdf' ? (inv.invoicePdf ?? inv.hostedInvoiceUrl) : (inv.hostedInvoiceUrl ?? inv.invoicePdf)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
    else toast('This invoice has no link yet.')
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-hairline bg-surface-2">
              {['Invoice', 'Date', 'Amount', 'Status'].map((heading) => (
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
            {invoices.map((inv) => {
              const badge = invoiceStatusBadge(inv.status)
              return (
                <tr
                  key={inv.id}
                  className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
                >
                  <td className="p-4 font-medium text-ink">{inv.number ?? inv.id}</td>
                  <td className="p-4 text-ink-subtle">{invoiceDate(inv.created)}</td>
                  {/* amountDue is the invoice total; amountPaid is 0 until paid, so it would show $0.00 on open/dunning rows */}
                  <td className="p-4 font-medium text-ink">{money(inv.amountDue, inv.currency)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                        badge.className,
                      )}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        icon={Download}
                        variant="ghost"
                        size="sm"
                        aria-label={`Download ${inv.number ?? inv.id}`}
                        onClick={() => open(inv, 'pdf')}
                      />
                      <IconButton
                        icon={Receipt}
                        variant="ghost"
                        size="sm"
                        aria-label={`View ${inv.number ?? inv.id}`}
                        onClick={() => open(inv, 'hosted')}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Wallet ledger types → display badges (see @fonderie/billing wallet ledger).
const ledgerBadge: Record<string, { label: string; className: string }> = {
  purchase: { label: 'Purchase', className: 'bg-primary/10 text-link' },
  grant: { label: 'Grant', className: 'bg-success/10 text-success' },
  usage: { label: 'Spend', className: 'bg-surface-2 text-ink-subtle' },
  refund: { label: 'Refund', className: 'bg-success/10 text-success' },
  adjustment: { label: 'Adjustment', className: 'bg-surface-2 text-ink-subtle' },
  expiry: { label: 'Expired', className: 'bg-surface-2 text-ink-subtle' },
}

const ledgerDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function CreditActivityTable() {
  const { transactions, isLoading, error, hasMore, loadMore } = useWalletTransactions()

  // Loading / error cards only on the INITIAL load — a failed `loadMore` sets
  // `error` too, and we must not wipe the rows already on screen for that.
  if (isLoading && transactions.length === 0) {
    return <Card className="p-12 text-center text-ink-subtle">Loading activity…</Card>
  }
  if (error && transactions.length === 0) {
    return <Card className="p-12 text-center text-error">Couldn't load credit activity.</Card>
  }
  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Coin className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
        <p className="text-ink-subtle">No credit activity yet.</p>
      </Card>
    )
  }

  const badgeFor = (t: IWalletTransactionDTO) => ledgerBadge[t.type] ?? ledgerBadge.adjustment

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
            {transactions.map((entry) => {
              const amount = Number(entry.amount)
              const badge = badgeFor(entry)
              return (
                <tr
                  key={entry.id}
                  className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
                >
                  <td className="p-4 text-ink-subtle">{ledgerDate(entry.createdAt)}</td>
                  <td className="p-4 text-ink">{entry.description ?? badge.label}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                        badge.className,
                      )}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className={cn('p-4 text-right font-medium', amount > 0 ? 'text-success' : 'text-ink')}>
                    {amount > 0 ? `+${amount}` : amount}
                  </td>
                  <td className="p-4 text-right font-medium text-ink">{entry.balanceAfter}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="border-t border-hairline p-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void loadMore().catch(() => toast.error('Could not load more activity.'))}
          >
            Load more
          </Button>
        </div>
      )}
    </Card>
  )
}

function PaymentMethodCard() {
  const { paymentMethod, isLoading } = usePaymentMethod()

  if (isLoading) {
    return <Card className="p-12 text-center text-ink-subtle">Loading…</Card>
  }
  if (!paymentMethod) {
    return (
      <Card className="p-12 text-center">
        <CreditCard className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
        <p className="text-ink-subtle">No payment methods on file.</p>
        <p className="mt-1 text-xs text-ink-subtle">A card is saved automatically the first time you buy credits or subscribe.</p>
      </Card>
    )
  }

  const brand = paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium text-ink">
            {brand} •••• {paymentMethod.last4}
          </p>
          <p className="text-sm text-ink-subtle">
            Expires {String(paymentMethod.expMonth).padStart(2, '0')}/{paymentMethod.expYear}
          </p>
        </div>
      </div>
    </Card>
  )
}

function SubscriptionPlans({ billingCycle, setBillingCycle }: { billingCycle: BillingCycle; setBillingCycle: (c: BillingCycle) => void }) {
  const { subscriptionTier } = useBilling()
  const { checkout, isLoading } = useCheckout()

  // Upgrades only: Stripe charges the difference going up, but moving down
  // mid-period would mean owing a prorated refund. The only path down is
  // Cancel Subscription, which runs to the end of the billing period.
  const effectiveTierId = subscriptionTier ?? 'free'
  const rank = (id: string) => subscriptionTiers.findIndex((t) => t.id === id)
  const currentRank = rank(effectiveTierId)

  const choose = async (tier: SubscriptionTier) => {
    try {
      const url = await checkout({ plan: tier.id, interval: billingCycle === 'annual' ? 'year' : 'month' })
      window.location.assign(url)
    } catch {
      toast.error('Could not start checkout. Please try again.')
    }
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
          const current = tier.id === effectiveTierId
          const isLower = rank(tier.id) < currentRank
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
                ) : isLower ? (
                  <>
                    <Button variant="secondary" fullWidth disabled>
                      Downgrade unavailable
                    </Button>
                    <p className="mt-2 text-center text-xs text-ink-subtle">
                      To move down, cancel your current plan — it stays active until the end of the
                      billing period.
                    </p>
                  </>
                ) : (
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    fullWidth
                    disabled={isLoading}
                    onClick={() => void choose(tier)}
                  >
                    Subscribe
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default function Billing() {
  const { creditBalance, subscriptionTier } = useBilling()
  const { activeJobs } = useJobs()
  const { cancel, isLoading: cancelling } = useCancelSubscription()
  // Detailed lifecycle state (cancel-scheduled? period end?) for the plan card —
  // page-local, alongside cancel/reactivate. The cross-cutting store only tracks
  // the plan name (navbar/dashboard); the schedule lives here.
  const { subscription, refresh: refreshSub } = useSubscription()
  const { reactivate, isLoading: resuming } = useReactivateSubscription()
  const [showSubscription, setShowSubscription] = useState(false)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [activeTab, setActiveTab] = useState('history')
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Return from a hosted checkout: the payment webhook credits the wallet /
  // activates the subscription server-side, so just re-read our state and
  // acknowledge. No client-side crediting.
  useEffect(() => {
    const status = searchParams.get('checkout')
    if (!status) return
    if (status === 'success') {
      void refreshBalance()
      void refreshSubscription()
      void refreshSub({ force: true })
      toast.success('Payment complete', { description: 'Your account has been updated.' })
    } else if (status === 'cancelled') {
      toast('Checkout cancelled — no charge was made.')
    }
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams, refreshSub])

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

  const confirmCancel = async () => {
    setConfirmingCancel(false)
    try {
      await cancel() // at period end by default — access continues until paid-through
      await Promise.all([refreshSubscription(), refreshSub({ force: true })])
      toast.success('Subscription cancelled', {
        description: 'You keep access until the end of the current billing period.',
      })
    } catch {
      toast.error('Could not cancel the subscription. Please try again.')
    }
  }

  // Un-cancel a subscription scheduled to end at period close (1:1 with the
  // Anthropic "resume" affordance — no provider portal round-trip).
  const confirmResume = async () => {
    try {
      await reactivate()
      await Promise.all([refreshSubscription(), refreshSub({ force: true })])
      toast.success('Subscription resumed', {
        description: 'Your plan will keep renewing as normal.',
      })
    } catch {
      // 409 → already fully canceled; the fix is a fresh checkout, not a resume.
      toast.error('Could not resume — the plan may have already ended. Start a new checkout to re-subscribe.')
    }
  }

  // A paid subscription set to cancel at period end (not yet fully canceled).
  const scheduledToCancel = subscription?.cancelAtPeriodEnd === true && subscription?.status !== 'canceled'
  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : '—'

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
            nextBillingDate={activeTier.id !== 'free' ? periodEnd : '—'}
            metrics={[
              { label: 'Active jobs', used: activeJobs.length, total: activeTier.limits.activeJobs },
              { label: 'Credits', used: creditBalance, total: activeTier.limits.creditsPerMonth },
            ]}
            scheduledToCancel={activeTier.id !== 'free' && scheduledToCancel}
            onCancel={
              activeTier.id !== 'free' && !scheduledToCancel ? () => setConfirmingCancel(true) : undefined
            }
            onResume={activeTier.id !== 'free' && scheduledToCancel ? () => void confirmResume() : undefined}
            resuming={resuming}
          />
          <CancelPlanDialog
            open={confirmingCancel}
            planName={activeTier.name}
            periodEnd="the end of your billing period"
            lostFeatures={activeTier.features.filter((f) => !subscriptionTiers[0].features.includes(f))}
            fallbackNote={`Afterwards you move to the Free plan: ${subscriptionTiers[0].features.join(' · ').toLowerCase()}.`}
            onConfirm={() => void confirmCancel()}
            onClose={() => setConfirmingCancel(false)}
            confirmDisabled={cancelling}
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
          {showSubscription ? (
            <SubscriptionPlans billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
          ) : (
            <CreditPacks />
          )}
        </div>
      </div>

      <div>
        <Tabs
          tabs={[
            { id: 'history', label: 'Invoices' },
            { id: 'activity', label: 'Credit Activity' },
            { id: 'methods', label: 'Payment Method' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-2">
          {activeTab === 'history' && <InvoicesTable />}
          {activeTab === 'activity' && <CreditActivityTable />}
          {activeTab === 'methods' && <PaymentMethodCard />}
        </div>
      </div>
    </div>
  )
}
