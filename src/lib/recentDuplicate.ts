// Pure duplicate-purchase detection, isolated from React so it's unit-testable.
// A purchase is a likely accidental repeat when an invoice of the SAME amount
// exists within the recent window (double-click, latency retry, impatient
// re-submit).

// The window within which an identical purchase is treated as a likely repeat.
export const DUPLICATE_WINDOW_MS = 5 * 60 * 1000

// Only the invoice fields this check reads (amounts are stringified cents).
export interface InvoiceLike {
  amountPaid: string
  status: string // 'paid' | 'open' | 'void' | 'uncollectible' | 'draft'
  created: string // ISO-8601
}

export function isRecentDuplicate(
  invoices: InvoiceLike[],
  amountCents: number,
  nowMs: number,
  windowMs: number = DUPLICATE_WINDOW_MS,
): boolean {
  return invoices.some((inv) => {
    // Only a SETTLED (paid) invoice is a real prior purchase. A declined,
    // draft, or still-open invoice of the same amount is not something the
    // user actually bought, so it must not trigger "you already purchased".
    if (inv.status !== 'paid') return false
    // Match on the paid amount in cents. Currency is intentionally NOT compared:
    // the purchase intent doesn't carry the charge currency (the UI shows USD
    // prices while Stripe may charge another, e.g. CAD), and our product amounts
    // are distinct enough that a cross-currency false match isn't a real risk.
    if (Number(inv.amountPaid) !== amountCents) return false
    // Guard against clock skew (future-dated invoice) as well as the window.
    const age = nowMs - new Date(inv.created).getTime()
    return age >= 0 && age < windowMs
  })
}
