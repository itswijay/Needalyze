'use client'

import {
  Activity,
  BookOpen,
  GraduationCap,
  HeartPulse,
  PiggyBank,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'

import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber, MotionItem, MotionList } from '@/components/ui/motion-primitives'
import { cn } from '@/lib/utils'

/**
 * The eight summary tiles.
 *
 * This was previously the same Card block written out eight times, differing
 * only in its label and which field of cardData it read. Describing them as
 * data instead means the layout is defined once — and it is what lets the
 * grid stagger its entry, since MotionList needs real children to orchestrate.
 *
 * Both groups render in one grid (4 cols at desktop width fits all 8 in 2
 * rows); `group` picks which slice of cardData a tile reads its value from,
 * and doubles as the accent-rail color so summary vs. category stays visible
 * without a separate section per group.
 *
 * At the 4-col breakpoint the two summary tiles are pinned to column 1 (one
 * per row) so they read as a stacked pair rather than leading the first row;
 * category tiles are left unpositioned and auto-flow into the cells that
 * leaves open. Below that breakpoint there's only 2-3 columns, so the pin is
 * dropped and every tile just follows source order.
 */
const SUMMARY_TILES = [
  {
    key: 'completedForms',
    label: 'Completed Forms',
    icon: ShieldCheck,
    group: 'summary',
    className: 'lg:col-start-1 lg:row-start-1',
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: Activity,
    group: 'summary',
    className: 'lg:col-start-1 lg:row-start-2',
  },
]

const CATEGORY_TILES = [
  { key: 'health', label: 'Health', icon: HeartPulse, group: 'category' },
  { key: 'education', label: 'Education', icon: GraduationCap, group: 'category' },
  { key: 'pensionfund', label: 'Pension Fund', icon: BookOpen, group: 'category' },
  { key: 'DependentsCostofLiving', label: 'Dependents Cost of Living', icon: Users, group: 'category' },
  { key: 'longTermSavings', label: 'Long Term Savings', icon: PiggyBank, group: 'category' },
  { key: 'shortTermSavings', label: 'Short Term Savings', icon: Wallet, group: 'category' },
]

const TILES = [...SUMMARY_TILES, ...CATEGORY_TILES]

const ACCENT_RAIL = {
  summary: 'before:bg-gradient-to-b before:from-primary-200 before:to-primary-400',
  category: 'before:bg-gradient-to-b before:from-secondary-300 before:to-success-300',
}

function StatTile({ label, value, icon: Icon, group = 'category', className }) {
  return (
    <MotionItem className={className}>
      <Card
        interactive
        className={cn(
          // The accent rail is a pseudo-element so it can follow the card's
          // rounded corner; the old version used a border-l, which squared it off.
          'relative h-full gap-0 overflow-hidden py-4 pl-5 sm:py-5',
          'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-[""]',
          ACCENT_RAIL[group]
        )}
      >
        <CardHeader className="items-center gap-3 px-4">
          <CardTitle className="flex items-center gap-2.5">
            <span className="hidden shrink-0 rounded-xl bg-surface-sunken p-2 text-brand-foreground sm:inline-flex">
              <Icon className="size-4" strokeWidth={2} />
            </span>
            <span className="line-clamp-2 text-xs leading-tight font-medium text-muted-foreground sm:text-sm">
              {label}
            </span>
          </CardTitle>

          <CardAction>
            <AnimatedNumber
              value={value ?? 0}
              startOnView={false}
              className="text-2xl font-semibold text-brand-foreground sm:text-4xl"
            />
          </CardAction>
        </CardHeader>
      </Card>
    </MotionItem>
  )
}

const Cards = ({ cardData }) => {
  return (
    <MotionList
      stagger={0.06}
      className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 sm:pt-5 md:gap-5 lg:grid-cols-4"
    >
      {TILES.map(({ key, label, icon, group, className }) => (
        <StatTile
          key={key}
          label={label}
          icon={icon}
          group={group}
          className={className}
          value={
            group === 'summary'
              ? cardData?.[key]
              : cardData?.categories?.[key]
          }
        />
      ))}
    </MotionList>
  )
}

export default Cards
