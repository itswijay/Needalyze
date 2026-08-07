'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { useMotion } from '@/lib/motion'

const InvalidLinkPage = () => {
  const m = useMotion()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-page px-4">
      <motion.div
        variants={m.fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md rounded-3xl border border-border/70 bg-surface-raised p-8 text-center shadow-lg"
      >
        <Image
          src="/images/invalid.png"
          alt=""
          width={48}
          height={48}
          className="mx-auto mb-6 h-auto w-12"
          priority
        />
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Invalid form link
        </h1>
        <p className="text-muted-foreground">
          Please check the link and try again.
        </p>
      </motion.div>
    </main>
  )
}

export default InvalidLinkPage
