'use client'

import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Shared Framer Motion vocabulary.
 *
 * Every animated component in the app pulls its variants from here rather
 * than writing them inline, so the whole UI moves with one set of timings and
 * a change to the feel of the app is a change to this file.
 *
 * Each variant is a factory taking a `reduce` flag instead of a plain object.
 * That is the important part: when a user has asked their OS for reduced
 * motion, an element that animates *in* must not simply have its animation
 * cancelled — it would be left at its starting `opacity: 0` and never appear.
 * Passing `reduce` collapses the distance and duration to nothing while
 * keeping the element's final, visible state intact.
 *
 * Prefer `useMotion()` in components; it resolves the flag once and hands
 * back the whole vocabulary already bound to it.
 */

// Mirrors --ease-out-expo and --ease-spring in globals.css.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]
export const EASE_SPRING = [0.34, 1.56, 0.64, 1]

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
}

export const fadeIn = (reduce = false) => ({
  hidden: { opacity: reduce ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: { duration: reduce ? 0 : DURATION.base, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: reduce ? 1 : 0,
    transition: { duration: reduce ? 0 : DURATION.fast },
  },
})

export const fadeInUp = (reduce = false) => ({
  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : DURATION.slow, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: reduce ? 1 : 0,
    y: reduce ? 0 : -8,
    transition: { duration: reduce ? 0 : DURATION.fast },
  },
})

export const fadeInDown = (reduce = false) => ({
  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : DURATION.slow, ease: EASE_OUT_EXPO },
  },
})

export const scaleIn = (reduce = false) => ({
  hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: reduce
      ? { duration: 0 }
      : { type: 'spring', stiffness: 320, damping: 28 },
  },
  exit: {
    opacity: reduce ? 1 : 0,
    scale: reduce ? 1 : 0.96,
    transition: { duration: reduce ? 0 : DURATION.fast },
  },
})

/**
 * Parent orchestrator for grids and lists. Children are driven by their own
 * `hidden`/`visible` variants; this only decides when each one starts.
 */
export const staggerContainer = (stagger = 0.06, delay = 0, reduce = false) => ({
  hidden: {},
  visible: {
    transition: reduce
      ? { staggerChildren: 0, delayChildren: 0 }
      : { staggerChildren: stagger, delayChildren: delay },
  },
})

/** Collapsible region — used for conditionally revealed form fields. */
export const collapse = (reduce = false) => ({
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: reduce ? 0 : DURATION.base, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: reduce ? 0 : DURATION.fast, ease: EASE_OUT_EXPO },
  },
})

/**
 * Form step transition. `direction` is +1 moving forward through the wizard
 * and -1 going back, so the content slides the way the user is travelling.
 */
export const stepVariants = (reduce = false) => ({
  hidden: (direction = 1) => ({
    opacity: reduce ? 1 : 0,
    x: reduce ? 0 : direction * 24,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: reduce ? 0 : DURATION.slow, ease: EASE_OUT_EXPO },
  },
  exit: (direction = 1) => ({
    opacity: reduce ? 1 : 0,
    x: reduce ? 0 : direction * -24,
    transition: { duration: reduce ? 0 : DURATION.base, ease: EASE_OUT_EXPO },
  }),
})

/** Radix dialog overlay and panel. */
export const overlayVariants = (reduce = false) => fadeIn(reduce)

export const dialogVariants = (reduce = false) => ({
  hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: reduce
      ? { duration: 0 }
      : { type: 'spring', stiffness: 340, damping: 30 },
  },
  exit: {
    opacity: reduce ? 1 : 0,
    scale: reduce ? 1 : 0.97,
    y: reduce ? 0 : 4,
    transition: { duration: reduce ? 0 : DURATION.fast, ease: EASE_OUT_EXPO },
  },
})

/** Tap feedback, spread onto any motion element that acts like a button. */
export const PRESSABLE = { whileTap: { scale: 0.97 } }

/** Hover lift for interactive cards. */
export const HOVER_LIFT = {
  whileHover: { y: -3, transition: { duration: DURATION.fast, ease: EASE_OUT_EXPO } },
}

/**
 * The vocabulary, resolved against the user's motion preference.
 *
 * @example
 *   const m = useMotion()
 *   <motion.div variants={m.fadeInUp} initial="hidden" animate="visible" />
 */
export function useMotion() {
  // `useReducedMotion` is null until it has read the media query, which only
  // happens after mount. Treating that as "animate" keeps the server and the
  // first client render identical.
  const reduce = useReducedMotion() ?? false

  return useMemo(
    () => ({
      reduce,
      fadeIn: fadeIn(reduce),
      fadeInUp: fadeInUp(reduce),
      fadeInDown: fadeInDown(reduce),
      scaleIn: scaleIn(reduce),
      collapse: collapse(reduce),
      step: stepVariants(reduce),
      dialog: dialogVariants(reduce),
      overlay: overlayVariants(reduce),
      stagger: (stagger, delay) => staggerContainer(stagger, delay, reduce),
      pressable: reduce ? {} : PRESSABLE,
      hoverLift: reduce ? {} : HOVER_LIFT,
      /** Duration helper for one-off transitions; 0 when motion is reduced. */
      duration: (seconds) => (reduce ? 0 : seconds),
    }),
    [reduce]
  )
}
