import type { Job } from '../data/jobs'

const escapeField = (value: string | null) => {
  const s = value ?? ''
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function downloadJobCsv(job: Job) {
  const header = 'Business,Address,Phone,Website,Email,Source'
  const rows = job.results.map((lead) =>
    [lead.business, lead.address, lead.phone, lead.website, lead.email, lead.source ?? 'maps']
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
