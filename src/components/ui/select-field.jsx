'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, X } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * A single-choice dropdown.
 *
 * Replaces six hand-rolled copies of the same widget — branch and position on
 * the registration form (which had one pair for its mobile tree and another
 * for its desktop tree) and both fields in the profile dialog. Each copy was a
 * div with an onClick, a manually managed open flag, and a
 * `document.addEventListener('mousedown')` outside-click handler, none of
 * which were reachable by keyboard.
 *
 * Radix Popover brings the dismiss behaviour, focus trapping and Escape
 * handling; the options are real buttons, so tab and arrow navigation work.
 *
 * @param {object} props
 * @param {string} props.value            Currently selected option, or ''.
 * @param {(value: string) => void} props.onChange
 * @param {string[]} props.options
 * @param {string} [props.placeholder]
 * @param {boolean} [props.clearable]     Offer "Clear selection". Default true.
 * @param {boolean} [props.invalid]       Render the error border.
 */
export function SelectField({
  value = '',
  onChange,
  options = [],
  placeholder = 'Select…',
  clearable = true,
  invalid = false,
  disabled = false,
  id,
  className,
  ...props
}) {
  const [open, setOpen] = React.useState(false)
  const listboxId = React.useId()
  const m = useMotion()

  const select = (next) => {
    onChange?.(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          // combobox rather than a bare button: it is the role that carries
          // aria-expanded and aria-invalid for a widget that opens a listbox.
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-invalid={invalid || undefined}
          className={cn(
            'flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-border bg-surface-sunken px-4 text-left text-sm',
            'transition-[color,background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out-expo)]',
            'outline-none focus-visible:border-primary-300 focus-visible:ring-ring/40 focus-visible:ring-[3px]',
            'disabled:pointer-events-none disabled:opacity-50',
            open && 'border-primary-300 bg-surface-raised',
            invalid && 'border-destructive ring-destructive/20 ring-[3px]',
            className
          )}
          {...props}
        >
          <span className={cn('truncate', !value && 'text-muted-foreground/80')}>
            {value || placeholder}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: m.duration(0.2), ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl border-border bg-surface-raised p-1.5 shadow-lg"
      >
        <div
          role="listbox"
          id={listboxId}
          aria-label={placeholder}
          className="max-h-56 overflow-y-auto"
        >
          <AnimatePresence initial={false}>
            {clearable && value && (
              <motion.button
                key="__clear"
                type="button"
                variants={m.collapse}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => select('')}
                className="flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <X className="size-3.5 shrink-0" />
                Clear selection
              </motion.button>
            )}
          </AnimatePresence>

          {options.map((option) => {
            const selected = option === value
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => select(option)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors',
                  selected
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'hover:bg-surface-hover'
                )}
              >
                <span className="truncate">{option}</span>
                {selected && <Check className="size-4 shrink-0" />}
              </button>
            )
          })}

          {options.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No options available.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SelectField
