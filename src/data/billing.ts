import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'

// Credit packs — one-time purchase
export interface CreditPack {
  id: string
  name: string
  credits: number
  price: number // in USD
  popular?: boolean
}

export const creditPacks: CreditPack[] = [
  { id: 'pack-100', name: 'Pack 100', credits: 100, price: 9 },
  { id: 'pack-300', name: 'Pack 300', credits: 300, price: 19 },
  { id: 'pack-500', name: 'Pack 500', credits: 500, price: 29, popular: true },
]

// Subscription tiers — recurring
export interface TierLimits {
  activeJobs: number | null // null = unlimited
  creditsPerMonth: number | null
}

export interface SubscriptionTier {
  id: string
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

export type BillingRecordType = 'subscription' | 'credits'

export interface BillingRecord {
  id: string
  date: string
  type: BillingRecordType
  description: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
}

export const billingHistory: BillingRecord[] = [
  { id: 'INV-001', date: 'May 1, 2025', type: 'subscription', description: 'Unlimited Plan — Monthly', amount: '$49.00', status: 'paid' },
  { id: 'CR-042', date: 'Apr 28, 2025', type: 'credits', description: 'Pack 500 — 500 credits', amount: '$29.00', status: 'paid' },
  { id: 'INV-002', date: 'Apr 1, 2025', type: 'subscription', description: 'Unlimited Plan — Monthly', amount: '$49.00', status: 'paid' },
  { id: 'CR-038', date: 'Mar 15, 2025', type: 'credits', description: 'Pack 100 — 100 credits', amount: '$9.00', status: 'paid' },
  { id: 'INV-003', date: 'Mar 1, 2025', type: 'subscription', description: 'Unlimited Plan — Monthly', amount: '$49.00', status: 'paid' },
]

// Credit ledger — every credit movement, newest first, so the current
// balance is always explainable from the entries alone
export type LedgerEntryType = 'purchase' | 'spend' | 'refund' | 'grant'

export interface LedgerEntry {
  id: string
  date: string // ISO
  type: LedgerEntryType
  description: string
  amount: number // signed: + for purchase/refund/grant, - for spend
  balanceAfter: number
}

const LEDGER_CAP = 50

// Demo checkout handshake: the buy button sets the intent, the success page
// consumes it exactly once. Dies when Stripe verifies sessions server-side.
export const CHECKOUT_INTENT_KEY = 'checkout-intent'
export const CHECKOUT_DONE_KEY = 'checkout-done'

export type BillingCycle = 'monthly' | 'annual'

export interface UsageState {
  creditsUsed: number // credits spent this month; refunds are subtracted back
}

interface BillingState {
  creditBalance: number
  subscriptionTier: string | null // null = no active sub, 'free' = free tier
  billingCycle: BillingCycle
  usage: UsageState
  ledger: LedgerEntry[]
}

const STORAGE_KEY = 'billing'

const defaults: BillingState = {
  creditBalance: 247,
  subscriptionTier: 'free',
  billingCycle: 'monthly',
  usage: { creditsUsed: 18 },
  // Demo window; entries reconcile step-by-step down to the seeded balance
  ledger: [
    { id: 'led-005', date: '2025-06-02T09:14:00Z', type: 'spend', description: 'Scrape job — Austin, TX', amount: -18, balanceAfter: 247 },
    { id: 'led-004', date: '2025-06-01T00:00:00Z', type: 'grant', description: 'Monthly free credits', amount: 50, balanceAfter: 265 },
    { id: 'led-003', date: '2025-05-25T15:40:00Z', type: 'spend', description: 'Scrape job — Chicago, IL', amount: -28, balanceAfter: 215 },
    { id: 'led-002', date: '2025-05-22T11:05:00Z', type: 'refund', description: 'Refund — failed job (Brooklyn, NY)', amount: 14, balanceAfter: 243 },
    { id: 'led-001', date: '2025-05-15T10:30:00Z', type: 'spend', description: 'Scrape job — Brooklyn, NY', amount: -14, balanceAfter: 229 },
  ],
}

const ledgerTypes: LedgerEntryType[] = ['purchase', 'spend', 'refund', 'grant']

function isLedgerEntry(value: unknown): value is LedgerEntry {
  if (typeof value !== 'object' || value === null) return false
  const e = value as Partial<LedgerEntry>
  return (
    typeof e.id === 'string' &&
    typeof e.date === 'string' &&
    typeof e.description === 'string' &&
    ledgerTypes.includes(e.type as LedgerEntryType) &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    typeof e.balanceAfter === 'number' &&
    Number.isFinite(e.balanceAfter)
  )
}

function readStored(): BillingState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return defaults
    const p = parsed as Partial<BillingState>
    const tierValid =
      p.subscriptionTier === null ||
      (typeof p.subscriptionTier === 'string' && subscriptionTiers.some((t) => t.id === p.subscriptionTier))
    const storedUsage: Partial<UsageState> = typeof p.usage === 'object' && p.usage !== null ? p.usage : {}
    const usageField = (value: unknown, fallback: number) =>
      typeof value === 'number' && value >= 0 ? value : fallback
    return {
      creditBalance:
        typeof p.creditBalance === 'number' && p.creditBalance >= 0 ? p.creditBalance : defaults.creditBalance,
      subscriptionTier: tierValid ? (p.subscriptionTier as string | null) : defaults.subscriptionTier,
      billingCycle: p.billingCycle === 'annual' ? 'annual' : 'monthly',
      usage: {
        creditsUsed: usageField(storedUsage.creditsUsed, defaults.usage.creditsUsed),
      },
      ledger: Array.isArray(p.ledger) ? p.ledger.filter(isLedgerEntry).slice(0, LEDGER_CAP) : defaults.ledger,
    }
  } catch {
    return defaults
  }
}

// Module-level store (same pattern as useTheme/useLocale) so the balance hero,
// sidebar, and settings all observe one balance
let state: BillingState = readStored()
const store = createSubscribable()

function update(next: Partial<BillingState>) {
  state = { ...state, ...next }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: keep the in-memory value for this session
  }
  store.emit()
}

function recordEntry(type: LedgerEntryType, description: string, amount: number, balanceAfter: number): LedgerEntry[] {
  const entry: LedgerEntry = {
    id: `led-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
    type,
    description,
    amount,
    balanceAfter,
  }
  return [entry, ...state.ledger].slice(0, LEDGER_CAP)
}

// Module-level actions so other stores (e.g. the jobs engine) can write
// billing state without going through a React hook
export function addCredits(amount: number, description: string) {
  const creditBalance = state.creditBalance + amount
  update({ creditBalance, ledger: recordEntry('purchase', description, amount, creditBalance) })
}

export function spendCredits(amount: number, description: string): boolean {
  if (state.creditBalance < amount) return false
  const creditBalance = state.creditBalance - amount
  update({
    creditBalance,
    usage: { creditsUsed: state.usage.creditsUsed + amount },
    ledger: recordEntry('spend', description, -amount, creditBalance),
  })
  return true
}

export function refundCredits(amount: number, description: string) {
  const creditBalance = state.creditBalance + amount
  update({
    creditBalance,
    usage: { creditsUsed: Math.max(0, state.usage.creditsUsed - amount) },
    ledger: recordEntry('refund', description, amount, creditBalance),
  })
}

export function useBilling() {
  const current = useSyncExternalStore(store.subscribe, () => state)
  return {
    ...current,
    addCredits,
    setSubscription: (tierId: string | null) => update({ subscriptionTier: tierId }),
    setBillingCycle: (cycle: BillingCycle) => update({ billingCycle: cycle }),
  }
}
