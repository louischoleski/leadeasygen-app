import { useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'
import { fonderie } from '../lib/fonderie'
import { apiErrorStatus } from '../lib/api'

// Cross-cutting billing state observed across the app (navbar, dashboard,
// settings, scrape form, billing page): the credit balance and the current
// subscription tier. Both come from @fonderie/billing — the wallet balance
// from GET /billing/wallet (which withBilling keeps current, including the
// monthly free grant) and the tier from GET /billing/subscription. Page-local
// billing data (ledger, invoices, card, checkout) is read directly from the
// react-billing hooks in the billing page, not mirrored here.

// ── Display config (frontend copy; the real money flow is billing's) ──────────

export type BillingCycle = 'monthly' | 'annual'

// Credit packs shown on the billing page. `id` MUST match the billing catalog
// (api src/billing/catalog.ts → wallet.creditPacks) — checkout sends it as
// packId and the server prices the pack from its own catalogue.
export interface CreditPack {
  id: string
  name: string
  credits: number
  price: number // USD, display only — the server is the source of truth
  popular?: boolean
}

export const creditPacks: CreditPack[] = [
  { id: 'small', name: '10 credits', credits: 10, price: 5 },
  { id: 'medium', name: '50 credits', credits: 50, price: 20 },
  { id: 'large', name: '100 credits', credits: 100, price: 35, popular: true },
]

export interface TierLimits {
  activeJobs: number | null // null = unlimited
  creditsPerMonth: number | null
}

export interface SubscriptionTier {
  id: string // matches the billing plan name ('free' | 'unlimited')
  name: string
  priceMonthly: number
  priceAnnual: number
  description: string
  features: string[]
  limits: TierLimits
  popular?: boolean
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Get started with limited scraping',
    features: ['50 credits/month', 'Basic support', '1 active job'],
    limits: { activeJobs: 1, creditsPerMonth: 50 },
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    priceMonthly: 49,
    priceAnnual: 39,
    description: 'Unlimited leads, no credit limits',
    features: ['Unlimited jobs', 'Unlimited credits', 'Priority support', 'CSV export', 'API access'],
    limits: { activeJobs: null, creditsPerMonth: null },
    popular: true,
  },
]

// ── Cross-cutting store (balance + tier), sourced from billing ────────────────

interface BillingState {
  creditBalance: number
  subscriptionTier: string | null // null until first read; then a plan name ('free'|'unlimited')
}

let state: BillingState = { creditBalance: 0, subscriptionTier: null }
const store = createSubscribable()

function update(next: Partial<BillingState>) {
  const merged = { ...state, ...next }
  if (merged.creditBalance === state.creditBalance && merged.subscriptionTier === state.subscriptionTier) {
    return // no change — don't churn subscribers
  }
  state = merged
  store.emit()
}

// Re-read the wallet balance from billing. Callable from non-React code (the
// jobs engine re-reads it when a scrape settles, since completion is when the
// server charges). Non-fatal: an unauthenticated / offline read leaves the
// current value in place. A call that arrives while one is in flight is NOT
// dropped — it schedules a trailing re-run, so the post-charge read (which may
// fire while an in-flight pre-charge read is still resolving) is never lost.
let balanceInFlight = false
let balancePending = false
export async function refreshBalance(): Promise<void> {
  if (balanceInFlight) {
    balancePending = true
    return
  }
  balanceInFlight = true
  try {
    do {
      balancePending = false
      const { result } = await fonderie.billing.getWallet({ bust: true })
      update({ creditBalance: Number(result.wallet.balance) })
    } while (balancePending) // a refresh requested mid-flight → read again
  } catch {
    // unauthenticated or api down — keep the current value
  } finally {
    balanceInFlight = false
  }
}

// Re-read the current subscription tier. A 404 means no subscription — the user
// is on the free plan (billing applies the free plan's rules to no-sub users).
// Same trailing-re-run dedup as refreshBalance.
let subInFlight = false
let subPending = false
export async function refreshSubscription(): Promise<void> {
  if (subInFlight) {
    subPending = true
    return
  }
  subInFlight = true
  try {
    do {
      subPending = false
      try {
        const { result } = await fonderie.billing.getSubscription({ bust: true })
        update({ subscriptionTier: result.subscription?.plan ?? 'free' })
      } catch (err) {
        if (apiErrorStatus(err) === 404) update({ subscriptionTier: 'free' })
        // other errors — keep the current value
      }
    } while (subPending)
  } finally {
    subInFlight = false
  }
}

export function useBilling() {
  const current = useSyncExternalStore(store.subscribe, () => state)
  // Load once on first mount of any consumer; the in-flight guards dedupe the
  // concurrent calls from multiple mounted consumers (navbar + page + …).
  useEffect(() => {
    void refreshBalance()
    void refreshSubscription()
  }, [])
  return current
}
