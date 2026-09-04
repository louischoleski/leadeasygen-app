import { CaretLeft, Download, MagnifyingGlass } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { statusConfig } from '../components/JobCard'
import { Progress } from '../components/Progress'
import { ResultsTable } from '../components/ResultsTable'
import { useJobs } from '../data/jobs'
import { downloadJobCsv } from '../lib/csv'
import { cn } from '../lib/cn'

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function JobDetail() {
  const { id } = useParams()
  const { jobs } = useJobs()
  const job = jobs.find((j) => j.id === id)

  useEffect(() => {
    document.title = 'LeadEasyGen — Job results'
  }, [])

  if (!job) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <Card className="p-8 text-center">
          <MagnifyingGlass className="mx-auto mb-3 h-10 w-10 text-ink-subtle" aria-hidden="true" />
          <h1 className="text-xl font-semibold tracking-tight text-ink">Job not found</h1>
          <p className="mt-1 text-sm text-ink-subtle">
            It may have been removed — only your latest 20 jobs are kept.
          </p>
          <Button variant="secondary" className="mt-6" asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const status = statusConfig[job.status]

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-subtle transition-colors hover:text-ink">
        <CaretLeft className="h-4 w-4" aria-hidden="true" /> Back to Dashboard
      </Link>

      <Card as="section" className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-card-title text-ink">
              {job.location} — {job.keywords.join(', ')}
            </h1>
            <p className="text-xs text-ink-subtle">
              {job.radiusKm ? `${job.radiusKm} km · ` : ''}{job.category ? `${job.category} · ` : ''}{formatDate(job.createdAt)} · {job.creditCost} {job.creditCost === 1 ? 'credit' : 'credits'}
            </p>
          </div>
          <span
            className={cn(
              'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-semibold',
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>

        {(job.status === 'queued' || job.status === 'running') && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-ink-subtle">
              <span>Scraping… results appear here when the job completes.</span>
            </div>
            <Progress value={job.progress} indeterminate={job.progress === 0} aria-label="Job progress" />
          </div>
        )}

        {job.status === 'failed' && (
          <p className="mt-4 text-sm text-error">
            {job.error ?? 'Job did not complete.'}
            <span className="ml-1 text-ink-subtle">· no credits charged</span>
          </p>
        )}

        {job.status === 'completed' && (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-subtle">{job.results.length} leads collected</p>
              <Button size="sm" variant="secondary" iconLeft={Download} onClick={() => downloadJobCsv(job)}>
                Download CSV
              </Button>
            </div>
            <div className="mt-3">
              <ResultsTable leads={job.results} />
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
