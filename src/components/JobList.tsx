import { useState } from 'react'
import { toast } from 'sonner'
import { cancelJob, retryJob, useJobs } from '../data/jobs'
import { useTranslation } from '../hooks/useTranslation'
import { JobCard } from './JobCard'
import { Tabs } from './Tabs'

export function JobList() {
  const { t } = useTranslation()
  const { activeJobs, completedJobs } = useJobs()
  const [activeTab, setActiveTab] = useState('active')

  const displayJobs = activeTab === 'active' ? activeJobs : completedJobs

  // The worker polls every minute, so the window between queuing and the scrape
  // starting is short. It is still worth offering: the wallet is charged on
  // COMPLETION, so cancelling a mistyped search is the difference between it
  // costing nothing and costing a credit — and a pending task also blocks
  // re-running the corrected search, which the server treats as a duplicate.
  const handleCancel = async (id: string) => {
    try {
      const { cancelled, alreadyRunning } = await cancelJob(id)
      // Report what actually happened. A job can span several keywords, so some
      // may already be underway — claiming the whole job was cancelled when a
      // scrape is still running would be a lie the user discovers later.
      if (cancelled > 0 && alreadyRunning === 0) toast.success(t('jobs.list.cancelled'))
      else if (cancelled > 0) toast.success(t('jobs.list.cancelledPartly', { count: alreadyRunning }))
      else toast.error(t('jobs.list.cancelTooLate'))
    } catch {
      toast.error(t('jobs.errors.scraperUnreachable'))
    }
  }

  const handleRetry = async (id: string) => {
    const result = await retryJob(id)
    if (result === null) return
    if (!result.ok) {
      toast.error(
        t(
          result.error === 'insufficient-credits'
            ? 'jobs.list.retryInsufficient'
            : 'jobs.errors.scraperUnreachable',
        ),
      )
      return
    }
    toast.success(t('jobs.list.restarted'), {
      description: t(
        result.creditCost === 1 ? 'jobs.chargedOnCompletionOne' : 'jobs.chargedOnCompletion',
        { count: result.creditCost },
      ),
    })
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'active', label: t('jobs.list.tabActive', { count: activeJobs.length }) },
          { id: 'history', label: t('jobs.list.tabHistory', { count: completedJobs.length }) },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {displayJobs.length === 0 ? (
        <div className="py-12 text-center text-sm text-ink-subtle">
          {activeTab === 'active' ? t('jobs.list.emptyActive') : t('jobs.list.emptyHistory')}
        </div>
      ) : (
        <div className="space-y-3">
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} onRetry={handleRetry} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  )
}
