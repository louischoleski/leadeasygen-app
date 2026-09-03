import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'

// Token packages — one-time purchase
export interface TokenPackage {
  id: string
  name: string
  credits: number
  price: number // in USD
  popular?: boolean
}

export const tokenPackages: TokenPackage[] = [
  { id: 'starter', name: 'Starter', credits: 100, price: 9 },
  { id: 'growth', name: 'Growth', credits: 500, price: 29, popular: true },
  { id: 'scale', name: 'Scale', credits: 2000, price: 99 },
]

// Subscription tiers — recurring
export interface SubscriptionTier {
  id: string
  name: string
  priceMonthly: number
  priceAnnual: number
  description: string
  features: string[]
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
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    priceAnnual: 39,
    description: 'Unlimited leads for growing teams',
    features: ['Unlimited jobs', 'Priority support', 'CSV export', 'API access', '10 team seats'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 199,
    priceAnnual: 159,
    description: 'Custom solutions at scale',
    features: ['Everything in Pro', 'Unlimited seats', 'White-label', 'Dedicated manager', 'Custom integrations'],
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
  { id: 'INV-001', date: 'May 1, 2025', type: 'subscription', description: 'Pro Plan — Monthly', amount: '$49.99', status: 'paid' },
  { id: 'CR-042', date: 'Apr 28, 2025', type: 'credits', description: 'Growth Package — 500 credits', amount: '$29.00', status: 'paid' },
  { id: 'INV-002', date: 'Apr 1, 2025', type: 'subscription', description: 'Pro Plan — Monthly', amount: '$49.99', status: 'paid' },
  { id: 'CR-038', date: 'Mar 15, 2025', type: 'credits', description: 'Starter Package — 100 credits', amount: '$9.00', status: 'paid' },
  { id: 'INV-003', date: 'Mar 1, 2025', type: 'subscription', description: 'Pro Plan — Monthly', amount: '$49.99', status: 'paid' },
]

export type BillingCycle = 'monthly' | 'annual'

interface BillingState {
  creditBalance: number
  subscriptionTier: string | null // null = no active sub, 'free' = free tier
  billingCycle: BillingCycle
}

const STORAGE_KEY = 'billing'

const defaults: BillingState = {
  creditBalance: 247,
  subscriptionTier: 'free',
  billingCycle: 'monthly',
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
    return {
      creditBalance:
        typeof p.creditBalance === 'number' && p.creditBalance >= 0 ? p.creditBalance : defaults.creditBalance,
      subscriptionTier: tierValid ? (p.subscriptionTier as string | null) : defaults.subscriptionTier,
      billingCycle: p.billingCycle === 'annual' ? 'annual' : 'monthly',
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

export function useBilling() {
  const current = useSyncExternalStore(store.subscribe, () => state)
  return {
    ...current,
    addCredits: (amount: number) => update({ creditBalance: state.creditBalance + amount }),
    setSubscription: (tierId: string | null) => update({ subscriptionTier: tierId }),
    setBillingCycle: (cycle: BillingCycle) => update({ billingCycle: cycle }),
  }
}
