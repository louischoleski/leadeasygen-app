import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/Button'

const packages = [
  { credits: 100, price: '$9' },
  { credits: 500, price: '$39' },
  { credits: 2000, price: '$129' },
]

export default function Credits() {
  return (
    <div className="w-full">
      <h1 className="text-headline mb-1 text-ink">Buy credits</h1>
      <p className="mb-6 text-sm text-ink-subtle">
        Credits are spent when running scraping jobs.{' '}
        <Link to="/settings" className="text-link underline">Back to settings</Link>
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((p) => (
          <div key={p.credits} className="card p-5 text-center">
            <div className="text-3xl font-bold text-ink">{p.credits}</div>
            <div className="text-xs text-ink-subtle">credits</div>
            <div className="text-card-title mt-2 text-ink">{p.price}</div>
            <Button fullWidth className="mt-4" onClick={() => toast('Checkout is not wired up yet')}>
              Select
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
