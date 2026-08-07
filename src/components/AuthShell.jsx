'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The split brand/form layout behind login, register, forgot-password and
 * reset-password.
 *
 * All four pages previously built this by hand, and three of them built it
 * *twice* — once for a mobile tree and once for a desktop tree, chosen at
 * runtime from a `window.innerWidth` check held in state. That approach cost
 * a blank placeholder on every first paint (the `isMobile === null` branch),
 * shipped no useful server-rendered markup, and meant every visual change had
 * to be made in two places.
 *
 * One tree, plain Tailwind breakpoints.
 *
 * @param {object} props
 * @param {string} [props.title]     Heading above the form.
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children  The form itself.
 * @param {React.ReactNode} [props.footer]  Links below the form.
 */
export function AuthShell({ title, subtitle, children, footer, className }) {
  const m = useMotion()

  return (
    <div className="flex min-h-dvh w-full flex-col md:flex-row">
      {/* ---------- Brand panel ---------- */}
      <div className="bg-gradient-brand relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden px-6 pt-10 pb-16 md:min-h-dvh md:w-1/2 md:py-0">
        {/* Soft depth behind the logo. aria-hidden and purely decorative; the
            drift is skipped entirely under reduced motion. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-primary-200/20 blur-3xl md:size-96"
          animate={m.reduce ? undefined : { y: [0, 24, 0], x: [0, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-16 size-72 rounded-full bg-info-300/10 blur-3xl md:size-96"
          animate={m.reduce ? undefined : { y: [0, -20, 0], x: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          variants={m.fadeInUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          <Image
            src="/images/logos/white-t.png"
            width={260}
            height={260}
            alt="Needalyze"
            priority
            className="h-auto w-32 md:w-[240px] lg:w-[260px]"
          />
          <p className="mt-4 hidden max-w-sm text-center text-sm leading-relaxed text-white/60 md:block">
            Digital insurance need analysis for advisors and their customers.
          </p>
        </motion.div>

        {/* The curved seam into the form panel, on small screens only. */}
        <div className="absolute -bottom-px left-0 w-full overflow-hidden leading-[0] md:hidden">
          <svg
            className="relative block h-[60px] w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
              className="fill-surface-page"
            />
          </svg>
        </div>
      </div>

      {/* ---------- Form panel ---------- */}
      <div className="bg-surface-page flex w-full flex-1 items-center justify-center px-4 py-10 md:w-1/2 md:px-8">
        <motion.div
          variants={m.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: m.duration(0.08) }}
          className={cn('w-full max-w-sm', className)}
        >
          {title && (
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          <div className="rounded-3xl border border-border/70 bg-surface-raised p-6 shadow-lg sm:p-8">
            {children}
          </div>

          {footer && <div className="mt-6">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}

export default AuthShell
