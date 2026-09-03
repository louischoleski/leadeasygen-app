import { CaretUp, ChartBar, Shield, TrendDown, TrendUp } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { ActiveUsersChart, SharePie, Spark } from '../components/charts'
import StatCard from '../components/StatCard'
import ViewHeader from '../components/ViewHeader'
import {
  activeUsers,
  customers,
  downloadsSpark,
  sessionStats,
  trafficSpark,
  visitorSpark,
} from '../data/dashboard'

const trafficStats = [
  { label: 'Today', value: '170,20', dir: 'up' },
  { label: 'Last month %', value: '%20,20', dir: 'down' },
  { label: 'Year', value: '2180,50', dir: 'up' },
]

export default function Dashboard() {
  useEffect(() => {
    const id = setTimeout(() => {
      toast.warning('You entered to LUNA', {
        description: 'Premium admin theme with Dark UI style.',
      })
    }, 1600)
    return () => clearTimeout(id)
  }, [])

  return (
    <div>
      <ViewHeader
        icon={Shield}
        title="Luna Admin Theme"
        aside={
          <small>
            Luna Admin Theme<br />Dashboard<br /> <span className="text-ink">v.1.4</span>
          </small>
        }
      >
        Special minimal admin theme with Dark UI style for monitoring or administration web applications.
      </ViewHeader>
      <hr className="mb-5 border-hairline" />

      <div className="grid grid-cols-2 gap-x-8 lg:grid-cols-6">
        {sessionStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}

        <div className="card relative col-span-2 mb-5 h-[114px] overflow-hidden">
          <div className="absolute inset-x-0 bottom-0">
            <Spark data={visitorSpark} height={47} />
          </div>
          <div className="p-6 pt-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-ink">
                  <span className="rounded-sm bg-primary px-1.5 py-0.5 text-xs font-medium text-on-primary">+45</span>{' '}
                  New visitor
                </div>
                <span className="text-xs text-ink-muted">
                  120,312 <CaretUp size={11} aria-hidden="true" className="inline text-success" /> -22%
                </span>
              </div>
              <button type="button" className="btn btn-secondary btn-xs relative z-10" disabled>
                See locations
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-5">
        <div className="grid md:grid-cols-3">
          <div className="p-6">
            <h3 className="mb-1 font-medium text-ink">
              <ChartBar size={16} aria-hidden="true" className="inline text-ink-subtle" /> Traffic source
            </h3>
            <div className="text-xs">
              Total users from the beginning of activity. See detailed charts for more information locations
              and traffic source.
            </div>

            <div className="my-3">
              <Spark data={trafficSpark} height={60} />
            </div>

            <div className="grid gap-x-8 md:grid-cols-3">
              {trafficStats.map((stat) => (
                <div key={stat.label}>
                  <small className="text-ink-subtle">{stat.label}</small>
                  <h4 className="mt-1 text-base font-medium text-ink">
                    {stat.value}{' '}
                    {stat.dir === 'up' ? (
                      <TrendUp size={14} aria-hidden="true" className="inline text-success" />
                    ) : (
                      <TrendDown size={14} aria-hidden="true" className="inline text-ink-subtle" />
                    )}
                  </h4>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 md:col-span-2">
            <ActiveUsersChart data={activeUsers} />
            <div className="mt-2 text-center text-xs">All active users from last month.</div>
          </div>
        </div>
      </div>

      <div className="grid gap-x-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="card mb-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2">
                  {['Name', 'Phone', 'Street Address', '% Share', 'City', 'Action'].map((heading) => (
                    <th key={heading} className="border-b border-hairline p-3 font-medium text-ink">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.name}
                    className="border-b border-hairline transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.phone}</td>
                    <td className="p-3">{customer.address}</td>
                    <td className="p-3"><SharePie values={customer.share} /></td>
                    <td className="p-3">{customer.city}</td>
                    <td className="p-3">
                      <button type="button" className="btn btn-secondary btn-xs" disabled>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="card mb-5 text-center">
            <div className="p-6">
              <h2 className="text-card-title text-ink">+280k downloads</h2>
              <div className="mb-2 text-xs">New downloads from the last month.</div>
              <span className="text-ink-muted">
                120,312{' '}
                <span className="text-xs">
                  <CaretUp size={11} aria-hidden="true" className="inline text-success" /> -22%
                </span>
              </span>
              <div className="mt-2.5">
                <Spark data={downloadsSpark} height={75} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
