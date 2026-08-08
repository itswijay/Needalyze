'use client'

import { motion } from 'framer-motion'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export default function FormContainer({ title, children, className = '' }) {
  const m = useMotion()

  return (
    <motion.div
      variants={m.fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'mx-auto flex w-full max-w-4xl flex-col rounded-3xl border border-border bg-surface-raised p-6 shadow-lg',
        'min-h-[80vh] sm:min-h-0 sm:p-10 md:p-12',
        className
      )}
    >
      {title && (
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight sm:mb-8">
          {title}
        </h2>
      )}
      <div className="flex-grow">{children}</div>
    </motion.div>
  )
}
