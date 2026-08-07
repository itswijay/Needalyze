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
 */
const SUMMARY_TILES = [
  { key: 'completedForms', label: 'Completed Forms', icon: ShieldCheck, accent: 'primary' },
  { key: 'inProgress', label: 'In Progress', icon: Activity, accent: 'primary' },
]

const CATEGORY_TILES = [
  { key: 'health', label: 'Health', icon: HeartPulse },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'pensionfund', label: 'Pension Fund', icon: BookOpen },
  { key: 'DependentsCostofLiving', label: 'Dependents Cost of Living', icon: Users },
  { key: 'longTermSavings', label: 'Long Term Savings', icon: PiggyBank },
  { key: 'shortTermSavings', label: 'Short Term Savings', icon: Wallet },
]

const ACCENT_RAIL = {
  primary: 'before:bg-gradient-to-b before:from-primary-200 before:to-primary-400',
  accent: 'before:bg-gradient-to-b before:from-secondary-300 before:to-success-300',
}

function StatTile({ label, value, icon: Icon, accent = 'accent' }) {
  return (
    <MotionItem>
      <Card
        interactive
        className={cn(
          // The accent rail is a pseudo-element so it can follow the card's
          // rounded corner; the old version used a border-l, which squared it off.
          'relative h-full gap-0 overflow-hidden py-4 pl-5 sm:py-5',
          'before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-[""]',
          ACCENT_RAIL[accent]
        )}
      >
        <CardHeader className="items-center gap-3 px-4">
          <CardTitle className="flex items-center gap-2.5">
            <span className="hidden shrink-0 rounded-xl bg-surface-sunken p-2 text-primary-300 sm:inline-flex">
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
              className="text-2xl font-semibold text-primary-300 sm:text-4xl"
            />
          </CardAction>
        </CardHeader>
      </Card>
    </MotionItem>
  )
}

const Cards = ({ cardData }) => {
  return (
    <div className="space-y-4 pt-4 sm:space-y-5">
      <MotionList stagger={0.06} className="grid grid-cols-2 gap-4 md:gap-5">
        {SUMMARY_TILES.map((tile) => (
          <StatTile key={tile.key} {...tile} value={cardData?.[tile.key]} />
        ))}
      </MotionList>

      <MotionList
        stagger={0.05}
        delay={0.12}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5"
      >
        {CATEGORY_TILES.map((tile) => (
          <StatTile
            key={tile.key}
            {...tile}
            value={cardData?.categories?.[tile.key]}
          />
        ))}
      </MotionList>
    </div>
  )
}

export default Cards
