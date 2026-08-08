'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The full-page waiting state, for auth checks and redirects.
 *
 * This markup was previously copy-pasted six times across the landing, login,
 * register and ProtectedRoute components as a bare
 * `animate-spin rounded-full h-12 w-12 border-b-2` div, each with its own
 * slightly different wrapper.
 *
 * @param {object} props
 * @param {string} [props.message]  Text under the spinner.
 * @param {boolean} [props.brand]   Render on the navy gradient with the
 *                                  reversed logo, for pre-auth screens.
 */
export function FullScreenLoader({ message = 'Loading…', brand = false, className }) {
  const m = useMotion()

  return (
    <div
      className={cn(
        'flex min-h-dvh w-full flex-col items-center justify-center gap-5',
        brand ? 'bg-gradient-brand' : 'bg-surface-page',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {brand && (
        <motion.div
          variants={m.fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Image
            src="/images/logos/white-t.png"
            width={160}
            height={160}
            alt="Needalyze"
            className="h-auto w-28 opacity-90 md:w-36"
            priority
          />
        </motion.div>
      )}

      {/* A ring with one bright quadrant, so the rotation is legible. Driven
          by Framer rather than `animate-spin` so the reduced-motion branch
          can swap it for a pulse instead of stopping dead. */}
      <motion.span
        className={cn(
          'block size-10 rounded-full border-[3px]',
          brand
            ? 'border-white/25 border-t-white'
            : // Track and highlight both have to flip with the theme. Naming
              // palette steps put the pale end on the track and the dark end
              // on the moving quadrant, which inverts in dark mode — the ring
              // ends up brighter than the thing meant to stand out on it.
              'border-border border-t-brand-foreground'
        )}
        animate={m.reduce ? { opacity: [0.4, 1, 0.4] } : { rotate: 360 }}
        transition={
          m.reduce
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.8, repeat: Infinity, ease: 'linear' }
        }
      />

      {message && (
        <p className={cn('text-sm', brand ? 'text-white/80' : 'text-muted-foreground')}>
          {message}
        </p>
      )}
    </div>
  )
}

export default FullScreenLoader
