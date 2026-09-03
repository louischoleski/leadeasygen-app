import { ArrowSquareOut, Envelope, Phone, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Lead } from '../data/jobs'

function copyToClipboard(text: string, message: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(message))
    .catch(() => toast.error('Failed to copy'))
}

const headings = ['Business', 'Category', 'Rating', 'Phone', 'Website', 'Emails', 'Address']

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
            {leads.map((lead, index) => {
              const emailsFull = lead.emails.join(', ')
              return (
                <tr
                  key={`${lead.name}-${index}`}
                  className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface-2/50"
                >
                  <td className="max-w-[200px] truncate p-4 font-medium text-ink" title={lead.name}>
                    {lead.name}
                  </td>
                  <td className="max-w-[160px] truncate p-4 text-ink-subtle" title={lead.category}>
                    {lead.category || '—'}
                  </td>
                  <td className="p-4">
                    {lead.rating !== null ? (
                      <span className="inline-flex items-center gap-1 text-ink">
                        <Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                        {lead.rating.toFixed(1)}
                        <span className="text-ink-subtle">({lead.reviews})</span>
                      </span>
                    ) : (
                      <span className="text-ink-subtle">—</span>
                    )}
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
                    {lead.emails.length > 0 ? (
                      <button
                        type="button"
                        title={emailsFull}
                        onClick={() =>
                          copyToClipboard(emailsFull, lead.emails.length > 1 ? 'Emails copied' : 'Email copied')
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 text-ink transition-colors hover:text-link"
                      >
                        <Envelope className="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                        <span className="max-w-[160px] truncate">{lead.emails[0]}</span>
                        {lead.emails.length > 1 && <span className="text-ink-subtle">+{lead.emails.length - 1}</span>}
                      </button>
                    ) : (
                      <span className="text-ink-subtle">—</span>
                    )}
                  </td>
                  <td className="max-w-[240px] truncate p-4 text-ink-subtle" title={lead.address}>
                    {lead.address}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
