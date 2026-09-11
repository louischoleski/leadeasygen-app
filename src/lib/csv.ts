import type { Job } from '../data/jobs'
import { tNow } from '../hooks/useTranslation'

const escapeField = (value: string | null) => {
  const s = value ?? ''
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function downloadJobCsv(job: Job) {
  // Headers are user-visible data — resolved in the active locale at
  // download time (tNow: this runs outside React).
  const header = [
    tNow('jobs.results.headers.business'),
    tNow('jobs.results.headers.category'),
    tNow('jobs.results.headers.rating'),
    tNow('jobs.results.headers.reviews'),
    tNow('jobs.results.headers.phone'),
    tNow('jobs.results.headers.website'),
    tNow('jobs.results.headers.emails'),
    tNow('jobs.results.headers.address'),
  ]
    .map(escapeField)
    .join(',')
  const rows = job.results.map((lead) =>
    [
      lead.name,
      lead.category,
      lead.rating !== null ? String(lead.rating) : '',
      String(lead.reviews),
      lead.phone,
      lead.website,
      lead.emails.join(';'),
      lead.address,
    ]
      .map(escapeField)
      .join(','),
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `leads-${job.location.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${job.id}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
