import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

/*
 * All chart colors are CSS custom properties so the charts re-theme with the
 * .dark class — no theme props need to be threaded through.
 */

type SparkProps = {
  data: number[]
  height: number
}

export function Spark({ data, height }: SparkProps) {
  const points = data.map((y, x) => ({ x, y }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <Area
          type="monotone"
          dataKey="y"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="var(--color-chart-1-fill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SharePie({ values }: { values: [number, number] }) {
  const colors = ['var(--color-chart-1)', 'var(--color-hairline-strong)']
  const data = values.map((v) => ({ v }))
  return (
    <PieChart width={24} height={24}>
      <Pie data={data} dataKey="v" cx="50%" cy="50%" outerRadius={12} stroke="none" isAnimationActive={false}>
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i]} />
        ))}
      </Pie>
    </PieChart>
  )
}

type ActiveUsersPoint = { x: number; previous: number; current: number }

export function ActiveUsersChart({ data }: { data: ActiveUsersPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
        <Area
          type="monotone"
          dataKey="current"
          stroke="var(--color-chart-1)"
          strokeWidth={1.5}
          fill="var(--color-chart-1-fill)"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="previous"
          stroke="var(--color-chart-2)"
          strokeWidth={1.5}
          fill="var(--color-chart-2-fill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
