import { ArrowSquareOut, Envelope, Phone } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Lead } from '../data/jobs'
import { cn } from '../lib/cn'

function copyToClipboard(text: string, message: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(message))
    .catch(() => toast.error('Failed to copy'))
}

const headings = ['Name', 'Address', 'Phone', 'Website', 'Email', 'Source']

export function ResultsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-hairline">
      <div className="max-h-[60vh] overflow-x-auto overflow-y-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-hairline bg-surface-2">
              {headings.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="h-10 px-4 text-left text-xs font-medium tracking-wider text-ink-subtle uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={`${lead.business}-${index}`}
                className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
              >
                <td className="max-w-[200px] truncate p-4 font-medium text-ink" title={lead.business}>
                  {lead.business}
                </td>
                <td className="max-w-[240px] truncate p-4 text-ink-subtle" title={lead.address}>
                  {lead.address}
                </td>
                <td className="p-4">
                  {lead.phone ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(lead.phone as string, 'Phone copied')}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-ink transition-colors hover:text-link"
                    >
                      <Phone className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                      <span>{lead.phone}</span>
                    </button>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="p-4">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-link hover:underline"
                    >
                      <span className="max-w-[120px] truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                      <ArrowSquareOut className="h-3.5 w-3.5 shrink-0" weight="bold" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="p-4">
                  {lead.email ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(lead.email as string, 'Email copied')}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-ink transition-colors hover:text-link"
                    >
                      <Envelope className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                      <span className="max-w-[160px] truncate">{lead.email}</span>
                    </button>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                      lead.source === 'website' ? 'bg-primary/10 text-link' : 'bg-surface-2 text-ink-subtle',
                    )}
                  >
                    {lead.source === 'website' ? 'Website' : 'Maps'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
