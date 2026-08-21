'use client'

import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { formatCategoryData } from '../utils/analyticsHelpers'

const PIE_COLORS = [
  '#0284c7', // Primary blue
  '#0d9488', // Teal
  '#16a34a', // Green
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
]

function CustomTooltip({ active, payload, totalCount }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const percentage =
      totalCount > 0 ? ((data.count / totalCount) * 100).toFixed(1) : 0

    return (
      <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-popover-foreground">
        <p className="text-xs font-semibold text-muted-foreground">{data.category}</p>
        <p className="mt-1 text-sm font-bold text-brand-foreground">
          {data.count} {data.count === 1 ? 'Client' : 'Clients'}{' '}
          <span className="text-xs font-normal text-muted-foreground">({percentage}%)</span>
        </p>
      </div>
    )
  }
  return null
}

function renderLegendText(value) {
  return (
    <span className="text-[11px] font-medium text-muted-foreground">{value}</span>
  )
}

export default function NeedsPieChart({ categories }) {
  const allCategoryData = useMemo(
    () => formatCategoryData(categories),
    [categories]
  )

  // Filter out zero-count items so slices are clean and readable
  const activeChartData = useMemo(
    () => allCategoryData.filter((item) => item.count > 0),
    [allCategoryData]
  )

  const totalCount = useMemo(
    () => activeChartData.reduce((acc, curr) => acc + curr.count, 0),
    [activeChartData]
  )

  if (totalCount === 0) {
    return (
      <div className="flex h-[200px] w-full flex-col items-center justify-center text-center">
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
    <div className="h-[200px] w-full pt-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 10, left: 10, bottom: 4 }}>
          <Pie
            data={activeChartData}
            cx="50%"
            cy="38%"
            innerRadius={32}
            outerRadius={52}
            paddingAngle={3}
            dataKey="count"
            nameKey="category"
          >
            {activeChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                stroke="var(--card, #ffffff)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip totalCount={totalCount} />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={7}
            formatter={renderLegendText}
            wrapperStyle={{ paddingTop: '4px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
