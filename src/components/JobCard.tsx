import { Download } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { jobCategoryLabel, type Job, type JobStatus } from '../data/jobs'
import { useTranslation } from '../hooks/useTranslation'
import { cn } from '../lib/cn'
import { downloadJobCsv } from '../lib/csv'
import { localeTags } from '../locales'
import { Button } from './Button'
import { Card } from './Card'
import { Progress } from './Progress'

// Badge style per status; the display labels live in the dictionary
// (jobs.status.*) so they follow the active locale.
export const statusConfig: Record<JobStatus, { className: string }> = {
  queued: { className: 'bg-surface-2 text-ink-subtle' },
  running: { className: 'bg-primary/10 text-link' },
  completed: { className: 'bg-success/10 text-success' },
  failed: { className: 'bg-error/10 text-error' },
}

const formatDate = (timestamp: number, localeTag: string) =>
  new Date(timestamp).toLocaleString(localeTag, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

interface JobCardProps {
  job: Job
  onRetry: (jobId: string) => void
}

export function JobCard({ job, onRetry }: JobCardProps) {
  const { t, m, locale } = useTranslation()
  const status = statusConfig[job.status]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-ink">
            {job.location} — {job.keywords.join(', ')}
          </h3>
          <p className="text-xs text-ink-subtle">
            {job.radiusKm ? `${job.radiusKm} km · ` : ''}{job.category ? `${jobCategoryLabel(m, job.category)} · ` : ''}{formatDate(job.createdAt, localeTags[locale])} · {t(job.creditCost === 1 ? 'jobs.creditsOne' : 'jobs.credits', { count: job.creditCost })}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-semibold',
            status.className,
          )}
        >
          {t(`jobs.status.${job.status}`)}
        </span>
      </div>

      {job.status === 'running' && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-ink-subtle">
            <span>{t('jobs.card.scraping')}</span>
            {job.keywords.length > 1 && (
              <span>
                {t('jobs.card.keywordsLeft', {
                  remaining: job.keywords.length - Math.round((job.progress / 100) * job.keywords.length),
                  total: job.keywords.length,
                })}
              </span>
            )}
          </div>
          <Progress value={job.progress} indeterminate={job.progress === 0} aria-label={t('jobs.progressLabel')} />
        </div>
      )}

      {job.status === 'failed' && (
        <p className="mt-4 text-sm text-error">
          {job.error ?? t('jobs.failedFallback')}
          <span className="ml-1 text-ink-subtle">{t('jobs.noCreditsCharged')}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {job.status === 'completed' && (
          <>
            <Button size="sm" variant="secondary" iconLeft={Download} onClick={() => downloadJobCsv(job)}>
              {t('jobs.downloadCsv')}
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/jobs/${job.id}`}>{t('jobs.card.viewLeads', { count: job.results.length })}</Link>
            </Button>
          </>
        )}
        {job.status === 'failed' && (
          <Button size="sm" variant="secondary" onClick={() => onRetry(job.id)}>
            {t('jobs.card.retry')}
          </Button>
        )}
      </div>
    </Card>
  )
}
