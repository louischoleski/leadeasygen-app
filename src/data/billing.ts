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
  { id: 'pack-100', name: 'Pack 100', credits: 100, price: 9 },
  { id: 'pack-300', name: 'Pack 300', credits: 300, price: 19 },
  { id: 'pack-500', name: 'Pack 500', credits: 500, price: 29, popular: true },
]

// Subscription tiers — recurring
export interface TierLimits {
  jobs: number | null // null = unlimited
  teamSeats: number | null
  apiCalls: number | null
  storageGB: number | null
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
    limits: { jobs: 1, teamSeats: 1, apiCalls: 1000, storageGB: 1 },
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    priceMonthly: 49,
    priceAnnual: 39,
    description: 'Unlimited leads, no credit limits',
    features: ['Unlimited jobs', 'Unlimited credits', 'Priority support', 'CSV export', 'API access'],
    limits: { jobs: null, teamSeats: null, apiCalls: null, storageGB: null },
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

export type BillingCycle = 'monthly' | 'annual'

export interface UsageState {
  jobs: number
  teamSeats: number
  apiCalls: number
  storageGB: number
}

interface BillingState {
  creditBalance: number
  subscriptionTier: string | null // null = no active sub, 'free' = free tier
  billingCycle: BillingCycle
  usage: UsageState
}

const STORAGE_KEY = 'billing'

const defaults: BillingState = {
  creditBalance: 247,
  subscriptionTier: 'free',
  billingCycle: 'monthly',
  usage: { jobs: 12, teamSeats: 3, apiCalls: 7500, storageGB: 2.5 },
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
        jobs: usageField(storedUsage.jobs, defaults.usage.jobs),
        teamSeats: usageField(storedUsage.teamSeats, defaults.usage.teamSeats),
        apiCalls: usageField(storedUsage.apiCalls, defaults.usage.apiCalls),
        storageGB: usageField(storedUsage.storageGB, defaults.usage.storageGB),
      },
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

// Module-level actions so other stores (e.g. the jobs engine) can write
// billing state without going through a React hook
export function addCredits(amount: number) {
  update({ creditBalance: state.creditBalance + amount })
}

export function spendCredits(amount: number): boolean {
  if (state.creditBalance < amount) return false
  update({ creditBalance: state.creditBalance - amount })
  return true
}

export function incrementJobsUsage() {
  update({ usage: { ...state.usage, jobs: state.usage.jobs + 1 } })
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
