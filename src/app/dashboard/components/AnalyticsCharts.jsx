'use client'

import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionItem, MotionList } from '@/components/ui/motion-primitives'
import NeedsPieChart from './NeedsPieChart'
import SubmissionsLineChart from './SubmissionsLineChart'

export default function AnalyticsCharts({ cardData, forms }) {
  return (
    <MotionList
      stagger={0.08}
      className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2"
    >
      <MotionItem>
        <Card className="h-full border border-border bg-surface-card shadow-xs transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-foreground">
              <span className="rounded-lg bg-primary-100 p-1.5 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <PieChartIcon className="size-4" />
              </span>
              Insurance Needs Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <NeedsPieChart categories={cardData?.categories} />
          </CardContent>
        </Card>
      </MotionItem>

      <MotionItem>
        <Card className="h-full border border-border bg-surface-card shadow-xs transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-foreground">
              <span className="rounded-lg bg-success-100 p-1.5 text-success-700 dark:bg-success-900/40 dark:text-success-300">
                <TrendingUp className="size-4" />
              </span>
              Submissions & Completion Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <SubmissionsLineChart forms={forms} />
          </CardContent>
        </Card>
      </MotionItem>
    </MotionList>
  )
}
