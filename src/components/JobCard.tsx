import { Download } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import type { Job, JobStatus } from '../data/jobs'
import { cn } from '../lib/cn'
import { downloadJobCsv } from '../lib/csv'
import { Button } from './Button'
import { Card } from './Card'
import { Progress } from './Progress'

export const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  queued: { label: 'Queued', className: 'bg-surface-2 text-ink-subtle' },
  running: { label: 'Running', className: 'bg-primary/10 text-link' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success' },
  failed: { label: 'Failed', className: 'bg-error/10 text-error' },
}

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

interface JobCardProps {
  job: Job
  onRetry: (jobId: string) => void
  onCancel: (jobId: string) => void
}

export function JobCard({ job, onRetry, onCancel }: JobCardProps) {
  const status = statusConfig[job.status]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-ink">
            {job.location} — {job.keywords.join(', ')}
          </h3>
          <p className="text-xs text-ink-subtle">
            {job.radiusKm} km · {job.category} · {formatDate(job.createdAt)} · {job.creditCost} credits
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

      {job.status === 'running' && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-ink-subtle">
            <span>Scraping…</span>
            <span>{job.leadsFound} leads found</span>
          </div>
          <Progress value={job.progress} aria-label="Job progress" />
        </div>
      )}

      {job.status === 'failed' && (
        <p className="mt-4 text-sm text-error">
          {job.error ?? 'Job did not complete.'}
          {job.refunded && <span className="ml-1 text-ink-subtle">· {job.creditCost} credits refunded</span>}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {job.status === 'completed' && (
          <>
            <Button size="sm" variant="secondary" iconLeft={Download} onClick={() => downloadJobCsv(job)}>
              Download CSV
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/jobs/${job.id}`}>View {job.results.length} leads</Link>
            </Button>
          </>
        )}
        {job.status === 'failed' && (
          <Button size="sm" variant="secondary" onClick={() => onRetry(job.id)}>
            Retry
          </Button>
        )}
        {(job.status === 'queued' || job.status === 'running') && (
          <Button size="sm" variant="ghost" onClick={() => onCancel(job.id)}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  )
}
