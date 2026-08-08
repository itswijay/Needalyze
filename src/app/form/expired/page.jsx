'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

import { useMotion } from '@/lib/motion'

const ExpiredLinkPage = () => {
  const m = useMotion()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-page px-4">
      <motion.div
        variants={m.fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg"
      >
        <Image
          src="/images/logos/secondary-t.png"
          alt="Needalyze"
          width={96}
          height={96}
          className="mx-auto mb-6 h-auto w-24 dark:brightness-0 dark:invert"
          priority
        />
        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-warning-50 text-warning-400 dark:bg-warning-700 dark:text-warning-100">
          <Clock className="size-6" />
        </span>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Your link has expired
        </h1>
        <p className="text-muted-foreground">
          Please contact support for assistance.
        </p>
      </motion.div>
    </main>
  )
}

export default ExpiredLinkPage
