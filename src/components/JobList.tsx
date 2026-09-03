import { Download, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cancelJob, retryJob, useJobs } from '../data/jobs'
import { ConfirmDialog } from './ConfirmDialog'
import { downloadJobCsv } from '../lib/csv'
import { Button } from './Button'
import { Card } from './Card'
import { IconButton } from './IconButton'
import { JobCard } from './JobCard'
import { ResultsTable } from './ResultsTable'
import { Tabs } from './Tabs'

function ResultsOverlay({ jobId, onClose }: { jobId: string; onClose: () => void }) {
  const { jobs } = useJobs()
  const job = jobs.find((j) => j.id === jobId)
  if (!job) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-overlay/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Results for ${job.location}`}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-4xl -translate-y-1/2"
      >
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-card-title text-ink">
                {job.location} — {job.keywords.join(', ')}
              </h3>
              <p className="mt-1 text-sm text-ink-subtle">{job.results.length} leads collected</p>
            </div>
            <IconButton icon={X} variant="ghost" size="sm" aria-label="Close results" onClick={onClose} autoFocus />
          </div>
          <div className="mt-4">
            <ResultsTable leads={job.results} />
          </div>
          <div className="mt-4">
            <Button size="sm" variant="secondary" iconLeft={Download} onClick={() => downloadJobCsv(job)}>
              Download CSV
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export function JobList() {
  const { activeJobs, completedJobs } = useJobs()
  const [activeTab, setActiveTab] = useState('active')
  const [viewingJobId, setViewingJobId] = useState<string | null>(null)
  const [cancellingJobId, setCancellingJobId] = useState<string | null>(null)

  const displayJobs = activeTab === 'active' ? activeJobs : completedJobs
  const cancellingJob = activeJobs.find((job) => job.id === cancellingJobId)

  const handleCancelConfirm = () => {
    if (!cancellingJob) return
    cancelJob(cancellingJob.id)
    toast('Job cancelled', { description: `${cancellingJob.creditCost} credits refunded.` })
    setCancellingJobId(null)
  }

  const handleRetry = (id: string) => {
    const result = retryJob(id)
    if (result === null) return
    if (!result.ok) {
      toast.error('Not enough credits to retry this job')
      return
    }
    toast.success('Scrape job restarted', { description: `${result.job.creditCost} credits deducted.` })
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'active', label: `Active (${activeJobs.length})` },
          { id: 'history', label: `History (${completedJobs.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {displayJobs.length === 0 ? (
        <div className="py-12 text-center text-sm text-ink-subtle">
          {activeTab === 'active' ? 'No active jobs. Start a new scrape above.' : 'No completed jobs yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {displayJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewResults={setViewingJobId}
              onRetry={handleRetry}
              onCancel={setCancellingJobId}
            />
          ))}
        </div>
      )}

      {viewingJobId && <ResultsOverlay jobId={viewingJobId} onClose={() => setViewingJobId(null)} />}

      <ConfirmDialog
        open={cancellingJob !== undefined}
        title="Cancel this job?"
        description={
          cancellingJob
            ? `Scraping ${cancellingJob.location} stops and ${cancellingJob.creditCost} credits are refunded.`
            : ''
        }
        confirmLabel="Cancel job"
        cancelLabel="Keep running"
        danger
        onConfirm={handleCancelConfirm}
        onClose={() => setCancellingJobId(null)}
      />
    </div>
  )
}
