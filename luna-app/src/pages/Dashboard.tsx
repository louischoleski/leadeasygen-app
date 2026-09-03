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
            Luna Admin Theme<br />Dashboard<br /> <span className="text-white">v.1.4</span>
          </small>
        }
      >
        Special minimal admin theme with Dark UI style for monitoring or administration web applications.
      </ViewHeader>
      <hr className="mb-5 border-line" />

      <div className="grid grid-cols-2 gap-x-8 lg:grid-cols-6">
        {sessionStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}

        <div className="relative col-span-2 mb-5 h-[114px] overflow-hidden rounded bg-panel">
          <div className="absolute inset-x-0 bottom-0">
            <Spark data={visitorSpark} height={47} />
          </div>
          <div className="p-4 pt-2.5">
            <div className="mt-2.5 flex items-start justify-between">
              <div>
                <div className="text-white">
                  <span className="rounded-sm bg-accent px-1.5 py-0.5 text-xs font-bold text-white">+45</span>{' '}
                  New visitor
                </div>
                <span className="text-[80%] text-white">
                  120,312 <CaretUp size={11} aria-hidden="true" className="inline text-warning" /> -22%
                </span>
              </div>
              <button type="button" className="btn btn-default btn-xs relative z-10" disabled>
                See locations
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded">
        <div className="grid md:grid-cols-3">
          <div className="p-4">
            <h4 className="mb-1 font-medium text-white">
              <ChartBar size={16} aria-hidden="true" className="inline text-warning" /> Traffic source
            </h4>
            <div className="text-[80%]">
              Total users from the beginning of activity. See detailed charts for more information locations
              and traffic source.
            </div>

            <div className="my-3">
              <Spark data={trafficSpark} height={60} />
            </div>

            <div className="grid gap-x-8 md:grid-cols-3">
              {trafficStats.map((stat) => (
                <div key={stat.label}>
                  <small className="text-faint">{stat.label}</small>
                  <h4 className="mt-1 text-base font-normal text-white">
                    {stat.value}{' '}
                    {stat.dir === 'up' ? (
                      <TrendUp size={14} aria-hidden="true" className="inline text-warning" />
                    ) : (
                      <TrendDown size={14} aria-hidden="true" className="inline text-white" />
                    )}
                  </h4>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 md:col-span-2">
            <div className="mt-[5px]">
              <ActiveUsersChart data={activeUsers} />
            </div>
            <div className="mt-2 text-center text-[80%]">All active users from last month.</div>
          </div>
        </div>
      </div>

      <div className="grid gap-x-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-5 overflow-x-auto rounded bg-panel">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {['Name', 'Phone', 'Street Address', '% Share', 'City', 'Action'].map((heading) => (
                    <th key={heading} className="border-b border-line p-3 font-medium text-bright">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.name}>
                    <td className="border-b border-line/50 p-3">{customer.name}</td>
                    <td className="border-b border-line/50 p-3">{customer.phone}</td>
                    <td className="border-b border-line/50 p-3">{customer.address}</td>
                    <td className="border-b border-line/50 p-3"><SharePie values={customer.share} /></td>
                    <td className="border-b border-line/50 p-3">{customer.city}</td>
                    <td className="border-b border-line/50 p-3">
                      <button type="button" className="btn btn-default btn-xs" disabled>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="mb-5 rounded bg-accent text-center text-white">
            <div className="p-5">
              <h2 className="text-[1.65rem] font-light">+280k downloads</h2>
              <div className="mb-2 text-[80%]">New downloads from the last month.</div>
              120,312{' '}
              <span className="text-[11px] font-light">
                <CaretUp size={11} aria-hidden="true" className="inline" /> -22%
              </span>
              <div className="mt-2.5">
                <Spark data={downloadsSpark} height={75} stroke="#ffffff" fill="#f7af3e" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
