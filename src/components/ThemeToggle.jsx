'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Light/dark switch for the dashboard navbar.
 *
 * `resolvedTheme` is unknowable on the server, so rendering the real icon
 * before mount would guarantee a hydration mismatch. Until then this renders a
 * same-sized placeholder, which keeps the navbar from reflowing when the real
 * button arrives.
 */
export function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const m = useMotion()

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  // A rounded square rather than a circle: it sits in a row of icon buttons,
  // which now take the control tier. Circles are kept for the avatar beside
  // it, which is round because of what it represents.
  const base = cn(
    'relative inline-flex size-9 items-center justify-center rounded-lg',
    'text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground',
    'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
    className
  )

  if (!mounted) {
    return <div className={base} aria-hidden="true" />
  }

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(base, 'cursor-pointer')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      {...m.pressable}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: m.reduce ? 0 : -60, scale: m.reduce ? 1 : 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: m.reduce ? 0 : 60, scale: m.reduce ? 1 : 0.6 }}
          transition={{ duration: m.duration(0.2) }}
          className="absolute inline-flex"
        >
          {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle
