import { Calendar, CheckCircle, Coin, Spinner, Users, type Icon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { JobList } from '../components/JobList'
import { ScrapeForm } from '../components/ScrapeForm'
import { useBilling } from '../data/billing'
import { useJobs } from '../data/jobs'

function StatCard({ label, value, icon: StatIcon }: { label: string; value: number; icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-subtle">{label}</p>
          <p className="text-2xl font-bold text-ink">{value}</p>
        </div>
        <StatIcon className="h-5 w-5 text-ink-subtle" aria-hidden="true" />
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { creditBalance } = useBilling()
  const { jobs, activeJobs, completedJobs } = useJobs()

  useEffect(() => {
    document.title = 'LeadEasyGen — Dashboard'
  }, [])

  const totalLeads = jobs.reduce(
    (sum, job) => sum + (job.status === 'completed' ? job.results.length : 0),
    0,
  )
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const jobsThisMonth = jobs.filter((job) => job.createdAt >= monthStart.getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Coin className="h-5 w-5 text-primary" weight="fill" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-ink-subtle">Available Credits</p>
            <p className="text-2xl font-bold text-ink">{creditBalance}</p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link to="/billing">Buy Credits</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active Jobs" value={activeJobs.length} icon={Spinner} />
        <StatCard label="Completed" value={completedJobs.length} icon={CheckCircle} />
        <StatCard label="Leads Found" value={totalLeads} icon={Users} />
        <StatCard label="This Month" value={jobsThisMonth.length} icon={Calendar} />
      </div>

      <ScrapeForm />

      <JobList />
    </div>
  )
}
