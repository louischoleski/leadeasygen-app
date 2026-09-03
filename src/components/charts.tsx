import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

type SparkProps = {
  data: number[]
  height: number
  stroke?: string
  fill?: string
}

export function Spark({ data, height, stroke = '#ffffff', fill = '#43454d' }: SparkProps) {
  const points = data.map((y, x) => ({ x, y }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <Area
          type="monotone"
          dataKey="y"
          stroke={stroke}
          strokeWidth={3}
          fill={fill}
          fillOpacity={1}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function SharePie({ values }: { values: [number, number] }) {
  const colors = ['#f7af3e', '#404652']
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
        <CartesianGrid stroke="#404652" vertical={false} />
        <Area
          type="monotone"
          dataKey="current"
          stroke="#f7af3e"
          strokeWidth={1}
          fill="#f7af3e"
          fillOpacity={0.9}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="previous"
          stroke="#de9536"
          strokeWidth={1}
          fill="#de9536"
          fillOpacity={0.9}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
