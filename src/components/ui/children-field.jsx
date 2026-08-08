'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  clampCount,
  formatChildrenAges,
  parseChildrenAges,
  MAX_AGE,
  MAX_CHILDREN,
} from '@/application/view-models/childrenAges'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Number of children, and one age input per child.
 *
 * The two used to be free-text fields — a count, and a comma-separated list of
 * ages — which could disagree with each other. A cross-field rule caught that
 * on submit, so the customer counted their children, typed a matching list,
 * punctuated it, and only then found out they had miscounted.
 *
 * Stepping the count spawns exactly that many age inputs, so the two cannot
 * disagree at all. The rule stays in the schema as a server-side guard that
 * nobody should ever see.
 *
 * Storage is untouched: this emits the same `{ count, ages }` pair the columns
 * already hold.
 *
 * @param {object} props
 * @param {number | string} props.count
 * @param {string} props.ages              comma-separated, as stored
 * @param {(next: { count: number, ages: string }) => void} props.onChange
 */
export function ChildrenField({
  count,
  ages,
  onChange,
  invalid = false,
  disabled = false,
  className,
}) {
  const m = useMotion()
  const total = clampCount(count)
  const slots = parseChildrenAges(ages, total)

  const emit = (nextCount, nextSlots) =>
    onChange?.({
      count: nextCount,
      ages: formatChildrenAges(nextSlots),
    })

  const setCount = (next) => {
    const bounded = clampCount(next)
    // Growing pads with blanks, shrinking drops the trailing children.
    emit(bounded, parseChildrenAges(formatChildrenAges(slots), bounded))
  }

  const setAge = (index, value) => {
    const digits = value.replace(/[^\d]/g, '').slice(0, 2)
    const next = [...slots]
    next[index] = digits
    emit(total, next)
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Stepper */}
      <div
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border border-border bg-surface-sunken px-2',
          'transition-[border-color,box-shadow] duration-200',
          invalid && 'border-destructive ring-destructive/20 ring-[3px]',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <StepperButton
          label="One fewer child"
          onClick={() => setCount(total - 1)}
          disabled={total <= 0}
        >
          <Minus className="size-4" />
        </StepperButton>

        <span
          aria-live="polite"
          className="tabular-figures text-sm font-medium"
        >
          {total === 0 ? 'No children' : `${total} ${total === 1 ? 'child' : 'children'}`}
        </span>

        <StepperButton
          label="One more child"
          onClick={() => setCount(total + 1)}
          disabled={total >= MAX_CHILDREN}
        >
          <Plus className="size-4" />
        </StepperButton>
      </div>

      {/* One age input per child */}
      <AnimatePresence initial={false}>
        {total > 0 && (
          <motion.div
            key="ages"
            variants={m.collapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 pt-0.5 sm:grid-cols-3">
              <AnimatePresence initial={false} mode="popLayout">
                {slots.map((age, index) => (
                  <motion.div
                    key={index}
                    layout={!m.reduce}
                    initial={{ opacity: 0, scale: m.reduce ? 1 : 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: m.reduce ? 1 : 0.95 }}
                    transition={{ duration: m.duration(0.18) }}
                  >
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Child {index + 1}
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={age}
                      onChange={(event) => setAge(index, event.target.value)}
                      placeholder="Age"
                      max={MAX_AGE}
                      disabled={disabled}
                      className="h-10 text-center"
                      aria-label={`Age of child ${index + 1}`}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepperButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md',
        'text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground',
        'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:opacity-40'
      )}
    >
      {children}
    </button>
  )
}

export default ChildrenField
