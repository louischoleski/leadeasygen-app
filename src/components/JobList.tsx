import { useState } from 'react'
import { toast } from 'sonner'
import { cancelJob, retryJob, useJobs } from '../data/jobs'
import { ConfirmDialog } from './ConfirmDialog'
import { JobCard } from './JobCard'
import { Tabs } from './Tabs'

export function JobList() {
  const { activeJobs, completedJobs } = useJobs()
  const [activeTab, setActiveTab] = useState('active')
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
            <JobCard key={job.id} job={job} onRetry={handleRetry} onCancel={setCancellingJobId} />
          ))}
        </div>
      )}

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
