'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * A labelled wizard field with its validation message.
 *
 * Step 1 previously wrote out nine bare <input> elements, each repeating the
 * same `border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2]` string and its
 * own error-border ternary. Five of them rendered the red border but no
 * message at all, so the only feedback for a bad phone number or a bad list
 * of children's ages was a toast that scrolled away.
 *
 * Rendering the message here means no field can be added without one.
 */
export function FormField({
  label,
  error,
  hint,
  className,
  children,
  ...inputProps
}) {
  const m = useMotion()

  return (
    <div className={cn('flex flex-col', className)}>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>

      {children ?? <Input aria-invalid={Boolean(error)} {...inputProps} />}

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            variants={m.collapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-1 ml-4 overflow-hidden text-xs text-destructive"
          >
            {error}
          </motion.p>
        ) : (
          hint && (
            <p className="mt-1 ml-4 text-xs text-muted-foreground">{hint}</p>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

export default FormField
