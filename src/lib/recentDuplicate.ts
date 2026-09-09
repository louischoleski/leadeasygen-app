// Pure duplicate-purchase detection, isolated from React so it's unit-testable.
// A purchase is a likely accidental repeat when an invoice of the SAME amount
// exists within the recent window (double-click, latency retry, impatient
// re-submit).

// The window within which an identical purchase is treated as a likely repeat.
export const DUPLICATE_WINDOW_MS = 5 * 60 * 1000

// Only the invoice fields this check reads (amounts are stringified cents).
export interface InvoiceLike {
  amountPaid: string
  amountDue: string
  created: string // ISO-8601
}

export function isRecentDuplicate(
  invoices: InvoiceLike[],
  amountCents: number,
  nowMs: number,
  windowMs: number = DUPLICATE_WINDOW_MS,
): boolean {
  return invoices.some((inv) => {
    const paid = Number(inv.amountPaid) || Number(inv.amountDue) || 0
    if (paid !== amountCents) return false
    const age = nowMs - new Date(inv.created).getTime()
    return age >= 0 && age < windowMs
  })
}
