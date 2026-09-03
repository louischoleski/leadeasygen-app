import { CheckCircle, Coin } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import {
  addCredits,
  CHECKOUT_DONE_KEY,
  CHECKOUT_INTENT_KEY,
  creditPacks,
  useBilling,
  type CreditPack,
} from '../data/billing'

type CheckoutState = { status: 'pending' } | { status: 'credited'; pack: CreditPack } | { status: 'none' }

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const { creditBalance } = useBilling()
  const consumed = useRef(false)
  const [state, setState] = useState<CheckoutState>({ status: 'pending' })

  useEffect(() => {
    document.title = 'LeadEasyGen — Checkout'
    if (consumed.current) return
    consumed.current = true
    const pack = creditPacks.find((p) => p.id === params.get('pack'))
    if (!pack) {
      setState({ status: 'none' })
      return
    }
    try {
      const intent = sessionStorage.getItem(CHECKOUT_INTENT_KEY)
      const done = sessionStorage.getItem(CHECKOUT_DONE_KEY)
      if (intent === pack.id) {
        sessionStorage.removeItem(CHECKOUT_INTENT_KEY)
        sessionStorage.setItem(CHECKOUT_DONE_KEY, pack.id)
        addCredits(pack.credits, `${pack.name} — ${pack.credits} credits`)
        setState({ status: 'credited', pack })
      } else if (done === pack.id) {
        // Refresh of an already-processed checkout: re-show the receipt, no re-credit
        setState({ status: 'credited', pack })
      } else {
        setState({ status: 'none' })
      }
    } catch {
      setState({ status: 'none' })
    }
  }, [params])

  if (state.status === 'pending') return null

  if (state.status === 'none') {
    return (
      <div className="mx-auto max-w-md pt-10">
        <Card className="p-8 text-center">
          <Coin className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
          <h1 className="text-xl font-semibold tracking-tight text-ink">No checkout in progress</h1>
          <p className="mt-1 text-sm text-ink-subtle">Start a purchase from the billing page.</p>
          <Button variant="secondary" className="mt-6" asChild>
            <Link to="/billing#packages">View credit packs</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md pt-10">
      <Card className="p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-success" aria-hidden="true" />
        <h1 className="text-xl font-semibold tracking-tight text-ink">Payment successful</h1>
        <p className="mt-1 text-sm text-ink-subtle">
          +{state.pack.credits.toLocaleString()} credits added to your balance.
        </p>
        <div className="mt-6 rounded-lg bg-surface-2 p-4">
          <p className="text-sm text-ink-subtle">New balance</p>
          <p className="text-3xl font-bold text-ink">{creditBalance.toLocaleString()}</p>
        </div>
        <p className="mt-4 text-xs text-ink-subtle">Demo checkout — no payment was processed.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/billing">View billing</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
