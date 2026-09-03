import { Check, Coin, CreditCard, Crown, Download, Plus, Receipt } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CurrentPlanCard } from '../components/CurrentPlanCard'
import { IconButton } from '../components/IconButton'
import { Tabs } from '../components/Tabs'
import { Toggle } from '../components/Toggle'
import {
  billingHistory,
  subscriptionTiers,
  creditPacks,
  useBilling,
  type BillingRecord,
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
  const { addCredits } = useBilling()

  return (
    <section id="packages" className="scroll-mt-20 space-y-4">
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
              onClick={() => {
                addCredits(pkg.credits, `${pkg.name} — ${pkg.credits} credits`)
                toast.success(`Added ${pkg.credits.toLocaleString()} credits`, {
                  description: 'Demo purchase — payments are not wired up yet.',
                })
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

function SubscriptionPlans() {
  const { billingCycle, setBillingCycle, subscriptionTier, setSubscription } = useBilling()

  const choose = (tier: SubscriptionTier) => {
    setSubscription(tier.id)
    toast.success(tier.id === 'free' ? 'Switched to the Free plan' : `Subscribed to ${tier.name}`, {
      description: 'Demo mode — no payment processed.',
    })
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
    </section>
  )
}

export default function Billing() {
  const { creditBalance, subscriptionTier, billingCycle, usage } = useBilling()
  const { activeJobs } = useJobs()
  const [showSubscription, setShowSubscription] = useState(false)
  const [activeTab, setActiveTab] = useState('history')
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
            onCancel={
              activeTier.id !== 'free'
                ? () => toast('Cancel subscription — Demo mode, no action taken')
                : undefined
            }
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
            { id: 'methods', label: 'Payment Methods' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-2">
          {activeTab === 'history' && <BillingHistoryTable />}
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
    </div>
  )
}
