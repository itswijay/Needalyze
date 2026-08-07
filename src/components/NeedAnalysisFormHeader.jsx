'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { useMotion } from '@/lib/motion'

export default function NeedAnalysisFormHeader() {
  const m = useMotion()

  return (
    // A three-column grid: logo | title | spacer. The title used to be
    // absolutely positioned at left-1/2 with a -50% translate, balanced by an
    // empty div whose width was hand-tuned per breakpoint to stop it drifting.
    <header className="bg-gradient-header grid h-20 w-full grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-24 sm:px-6 md:px-8">
      <motion.div
        variants={m.fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center"
      >
        <Image
          src="/images/logos/secondary-white-t.png"
          alt="Needalyze"
          width={70}
          height={70}
          className="size-12 object-contain sm:size-16 md:size-[70px]"
          priority
        />
      </motion.div>

      <motion.h1
        variants={m.fadeInDown}
        initial="hidden"
        animate="visible"
        className="text-center text-[17px] font-semibold text-white sm:text-2xl md:text-3xl"
      >
        Need Analyze Form
      </motion.h1>

      <div aria-hidden="true" />
    </header>
  )
}
