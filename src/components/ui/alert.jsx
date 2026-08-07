'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Inline status banner.
 *
 * The auth pages, the profile dialog and the registration form each carried
 * their own hand-rolled version of this — a div with bg-blue-50/bg-red-50/
 * bg-green-50, a border, and in one case an inlined SVG info icon.
 *
 * Animates itself on mount, so callers only need to wrap it in AnimatePresence
 * to get the exit.
 */
const alertVariants = cva(
  'flex w-full items-start gap-3 rounded-2xl border p-4 text-sm',
  {
    variants: {
      variant: {
        info: 'border-info-100 bg-info-50 text-info-500 dark:border-info-600 dark:bg-info-800 dark:text-info-100',
        success:
          'border-success-100 bg-success-50 text-success-500 dark:border-success-600 dark:bg-success-800 dark:text-success-100',
        error:
          'border-error-100 bg-error-50 text-error-500 dark:border-error-600 dark:bg-error-800 dark:text-error-100',
        warning:
          'border-warning-100 bg-warning-50 text-warning-500 dark:border-warning-600 dark:bg-warning-800 dark:text-warning-100',
      },
    },
    defaultVariants: { variant: 'info' },
  }
)

const ICONS = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
}

export function Alert({ variant = 'info', title, children, className, ...props }) {
  const m = useMotion()
  const Icon = ICONS[variant] ?? Info

  return (
    <motion.div
      role="status"
      variants={m.collapse}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </motion.div>
  )
}

export { alertVariants }
export default Alert
