'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCategoryData } from '../utils/analyticsHelpers'

const BAR_COLORS = [
  '#0284c7', // Primary blue
  '#0d9488', // Teal
  '#16a34a', // Green
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
]

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-popover-foreground">
        <p className="text-xs font-semibold text-muted-foreground">{data.category}</p>
        <p className="mt-1 text-sm font-bold text-brand-foreground">
          {data.count} {data.count === 1 ? 'Client' : 'Clients'}
        </p>
      </div>
    )
  }
  return null
}

export default function NeedsBarChart({ categories }) {
  const chartData = useMemo(
    () => formatCategoryData(categories),
    [categories]
  )

  const totalCount = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  )

  if (totalCount === 0) {
    return (
      <div className="flex h-[260px] w-full flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No insurance needs recorded yet.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Submissions will appear here once clients complete the analysis.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[260px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e5e7eb)" opacity={0.5} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            className="text-muted-foreground"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted, #f3f4f6)', opacity: 0.4 }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
