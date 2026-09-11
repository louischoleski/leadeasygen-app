import { useState } from 'react'
import { toast } from 'sonner'
import { retryJob, useJobs } from '../data/jobs'
import { useTranslation } from '../hooks/useTranslation'
import { JobCard } from './JobCard'
import { Tabs } from './Tabs'

export function JobList() {
  const { t } = useTranslation()
  const { activeJobs, completedJobs } = useJobs()
  const [activeTab, setActiveTab] = useState('active')

  const displayJobs = activeTab === 'active' ? activeJobs : completedJobs

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
            <JobCard key={job.id} job={job} onRetry={handleRetry} />
          ))}
        </div>
      )}
    </div>
  )
}
