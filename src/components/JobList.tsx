import { useState } from 'react'
import { toast } from 'sonner'
import { retryJob, useJobs } from '../data/jobs'
import { JobCard } from './JobCard'
import { Tabs } from './Tabs'

export function JobList() {
  const { activeJobs, completedJobs } = useJobs()
  const [activeTab, setActiveTab] = useState('active')

  const displayJobs = activeTab === 'active' ? activeJobs : completedJobs

  const handleRetry = async (id: string) => {
    const result = await retryJob(id)
    if (result === null) return
    if (!result.ok) {
      toast.error(
        result.error === 'insufficient-credits'
          ? 'Not enough credits to retry this job'
          : 'Could not reach the scraper — try again shortly',
      )
      return
    }
    toast.success('Scrape job restarted', {
      description: `${result.creditCost} ${result.creditCost === 1 ? 'credit' : 'credits'} charged on completion.`,
    })
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
            <JobCard key={job.id} job={job} onRetry={handleRetry} />
          ))}
        </div>
      )}
    </div>
  )
}
