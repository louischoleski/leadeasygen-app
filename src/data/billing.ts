import { useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'
import { fonderie } from '../lib/fonderie'
import { apiErrorStatus } from '../lib/api'
import type { Messages } from '../locales'

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
// packId and the server prices the pack from its own catalogue. Display copy
// (a pack is named by its credit count) lives in the locale dictionaries
// under billing.packs.
export interface CreditPack {
  id: string
  credits: number
  price: number // USD, display only — the server is the source of truth
  popular?: boolean
}

export const creditPacks: CreditPack[] = [
  { id: 'small', credits: 10, price: 5 },
  { id: 'medium', credits: 50, price: 20 },
  { id: 'large', credits: 100, price: 38, popular: true },
]

export interface TierLimits {
  activeJobs: number | null // null = unlimited
  creditsPerMonth: number | null
}

// Tier display copy (name, description, features) lives in the locale
// dictionaries under billing.tiers, keyed by these ids.
export interface SubscriptionTier {
  id: string // matches the billing plan name ('free' | 'unlimited')
  priceMonthly: number
  priceAnnual: number
  limits: TierLimits
  popular?: boolean
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    priceMonthly: 0,
    priceAnnual: 0,
    limits: { activeJobs: 1, creditsPerMonth: 5 },
  },
  {
    id: 'unlimited',
    priceMonthly: 49,
    priceAnnual: 39,
    limits: { activeJobs: null, creditsPerMonth: null },
    popular: true,
  },
]

// Localized display name for a tier id ('free' | 'unlimited'); undefined until
// billing's first read resolves so callers can render no plan line at all.
export function tierDisplayName(m: Messages, id: string | null): string | undefined {
  if (!id) return undefined
  return (m.billing.tiers as Record<string, { name: string } | undefined>)[id]?.name
}

// Localized marketing description for a tier id; empty for unknown ids.
export function tierDescription(m: Messages, id: string): string {
  return (m.billing.tiers as Record<string, { description?: string } | undefined>)[id]?.description ?? ''
}

// Localized feature list for a tier id; empty for unknown ids.
export function tierFeatures(m: Messages, id: string): string[] {
  return (m.billing.tiers as Record<string, { features?: string[] } | undefined>)[id]?.features ?? []
}

// A subscriber on an unlimited-credits plan can't buy credit packs — the server
// blocks it (blockPacksWhileSubscribed) — so every "Buy credits" CTA is hidden
// for them and job submission never gates on balance. Centralised so the whole
// app agrees on when purchasing credits is even possible.
export function hasUnlimitedCredits(subscriptionTier: string | null): boolean {
  return subscriptionTiers.find((t) => t.id === subscriptionTier)?.limits.creditsPerMonth === null
}

// ── Cross-cutting store (balance + tier), sourced from billing ────────────────

interface BillingState {
  creditBalance: number // total spendable = granted + purchased
  // The wallet splits into two buckets: `granted` is the plan's monthly
  // allowance (resets each cycle), `purchased` is pack credits (never expire).
  // Spend is allowance-first, so granted depletes before purchased.
  grantedCredits: number
  purchasedCredits: number
  // When the current monthly allowance expires and the next grant lands — i.e.
  // when free-plan credits renew. ISO string, or null if the wallet has no
  // periodic grant (e.g. Unlimited). Drives the "Credits reset" date.
  grantedExpiresAt: string | null
  subscriptionTier: string | null // null until first read; then a plan name ('free'|'unlimited')
}

let state: BillingState = {
  creditBalance: 0,
  grantedCredits: 0,
  purchasedCredits: 0,
  grantedExpiresAt: null,
  subscriptionTier: null,
}
const store = createSubscribable()

function update(next: Partial<BillingState>) {
  const merged = { ...state, ...next }
  if (
    merged.creditBalance === state.creditBalance &&
    merged.grantedCredits === state.grantedCredits &&
    merged.purchasedCredits === state.purchasedCredits &&
    merged.grantedExpiresAt === state.grantedExpiresAt &&
    merged.subscriptionTier === state.subscriptionTier
  ) {
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
      const w = result.wallet
      update({
        creditBalance: Number(w.balance),
        // Older APIs may omit the split — fall back so the monthly bar still works.
        grantedCredits: Number(w.granted ?? w.balance),
        purchasedCredits: Number(w.purchased ?? 0),
        grantedExpiresAt: w.grantedExpiresAt ?? null,
      })
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
        // Only an active (or trialing) subscription grants its tier. An
        // 'incomplete' / 'past_due' / 'canceled' subscription must NOT unlock
        // the plan — otherwise starting checkout (which creates an incomplete
        // subscription before payment) would grant Unlimited for free.
        const sub = result.subscription
        const grants = sub != null && (sub.status === 'active' || sub.status === 'trialing')
        update({ subscriptionTier: grants ? sub.plan : 'free' })
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
  return { ...current, creditsUnlimited: hasUnlimitedCredits(current.subscriptionTier) }
}
