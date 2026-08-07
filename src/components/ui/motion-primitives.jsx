'use client'

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The handful of motion wrappers used across more than one screen. Anything
 * needed by a single component stays in that component; this is only the
 * shared vocabulary made concrete.
 */

/** Route-level entry. Wrap a page body to fade it up on mount. */
export function PageTransition({ children, className, ...props }) {
  const m = useMotion()

  return (
    <motion.div
      variants={m.fadeIn}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Orchestrating parent. Children rendered as <MotionItem> animate in sequence
 * rather than all at once.
 */
export function MotionList({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as: Component = 'div',
  ...props
}) {
  const m = useMotion()
  const MotionComponent = React.useMemo(() => motion.create(Component), [Component])

  return (
    <MotionComponent
      variants={m.stagger(stagger, delay)}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

/** A child of MotionList. Rises and fades on its turn. */
export function MotionItem({ children, className, as: Component = 'div', ...props }) {
  const m = useMotion()
  const MotionComponent = React.useMemo(() => motion.create(Component), [Component])

  return (
    <MotionComponent variants={m.fadeInUp} className={className} {...props}>
      {children}
    </MotionComponent>
  )
}

/**
 * A number that counts to its value instead of snapping to it.
 *
 * Driven by a spring rather than a timed tween so that a value changing while
 * the previous animation is still running retargets smoothly instead of
 * restarting. Under reduced motion it renders the formatted value directly and
 * subscribes to nothing.
 */
export function AnimatedNumber({
  value = 0,
  format = (n) => Math.round(n).toLocaleString(),
  className,
  startOnView = true,
  ...props
}) {
  const m = useMotion()
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldRun = !startOnView || isInView

  const numeric = Number(value) || 0
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20, mass: 0.6 })
  const [display, setDisplay] = React.useState(() => format(m.reduce ? numeric : 0))

  React.useEffect(() => {
    if (m.reduce) {
      setDisplay(format(numeric))
      return
    }
    if (shouldRun) motionValue.set(numeric)
    // `format` is intentionally not a dependency: callers pass it inline, so a
    // new function identity every render would restart the count on each one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeric, shouldRun, m.reduce, motionValue])

  React.useEffect(() => {
    if (m.reduce) return undefined
    const unsubscribe = spring.on('change', (latest) => setDisplay(format(latest)))
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spring, m.reduce])

  return (
    <span ref={ref} className={cn('tabular-figures', className)} {...props}>
      {display}
    </span>
  )
}

/** Card that lifts on hover and presses on tap. */
export function MotionCard({ children, className, interactive = true, ...props }) {
  const m = useMotion()

  return (
    <motion.div
      variants={m.fadeInUp}
      className={className}
      {...(interactive ? m.hoverLift : {})}
      {...props}
    >
      {children}
    </motion.div>
  )
}
