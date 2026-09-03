import { XCircle } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

export default function CheckoutCancelled() {
  useEffect(() => {
    document.title = 'LeadEasyGen — Checkout'
  }, [])

  return (
    <div className="mx-auto max-w-md pt-10">
      <Card className="p-8 text-center">
        <XCircle className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
        <h1 className="text-xl font-semibold tracking-tight text-ink">Payment cancelled</h1>
        <p className="mt-1 text-sm text-ink-subtle">You weren't charged — your balance is unchanged.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild>
            <Link to="/billing#packages">Back to credit packs</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
