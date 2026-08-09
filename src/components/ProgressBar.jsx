'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export default function ProgressBar({
  currentStep = 2,
  totalSteps = 4,
  maxStep,
  onStepClick,
}) {
  const m = useMotion()

  // How far the customer has actually got. Steps behind that stay reachable in
  // both directions: walking backwards only was enough while a step could not
  // be re-entered, but someone reopening a finished form starts at the step
  // they left off at and has to be able to move around it.
  const furthest = Math.max(maxStep ?? currentStep, currentStep)

  const handleStepClick = (stepNumber) => {
    if (stepNumber !== currentStep && stepNumber <= furthest && onStepClick) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className="mx-auto w-full max-w-xs px-4 py-5 sm:max-w-lg sm:px-6 sm:py-6 md:max-w-xl md:px-8 md:py-8 lg:max-w-2xl">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          // Done is done, wherever the customer is standing now — a step
          // behind the furthest reached keeps its tick even when they step
          // back to it.
          const isCompleted = !isActive && stepNumber < furthest
          const isClickable = !isActive && stepNumber <= furthest && onStepClick

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <motion.button
                type="button"
                onClick={() => handleStepClick(stepNumber)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                animate={
                  // A single attention pulse when a step becomes current —
                  // it settles rather than looping, so it reads as an arrival
                  // and not as a permanent decoration.
                  isActive && !m.reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={isClickable && !m.reduce ? { scale: 1.1 } : undefined}
                whileTap={isClickable && !m.reduce ? { scale: 0.95 } : undefined}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border text-xs font-semibold sm:size-9 md:size-10 sm:text-sm',
                  'transition-colors duration-300',
                  isActive &&
                    'border-primary-400 bg-primary-200 text-white shadow-md',
                  isCompleted && 'border-primary-400 bg-primary-300 text-white',
                  !isActive &&
                    !isCompleted &&
                    'border-border bg-surface-sunken text-muted-foreground',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
                title={
                  isClickable
                    ? `Go to Step ${stepNumber}`
                    : isActive
                      ? 'Current Step'
                      : `Step ${stepNumber}`
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isCompleted ? 'check' : 'number'}
                    initial={{ opacity: 0, scale: m.reduce ? 1 : 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: m.reduce ? 1 : 0.5 }}
                    transition={{ duration: m.duration(0.18) }}
                    className="flex items-center justify-center"
                  >
                    {isCompleted ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      stepNumber
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Progress Line (don't show after last step) */}
              {stepNumber < totalSteps && (
                <div className="relative mx-2 h-1 w-12 overflow-hidden rounded-full bg-surface-sunken sm:mx-3 sm:w-16 md:mx-4 md:w-20 lg:w-24">
                  {/* One bar that grows, rather than the two separately
                      rendered half- and full-width divs this used to have. */}
                  <motion.div
                    className={cn(
                      'absolute inset-y-0 left-0 w-full origin-left rounded-full',
                      isCompleted ? 'bg-primary-300' : 'bg-primary-200'
                    )}
                    initial={false}
                    animate={{
                      scaleX: isCompleted ? 1 : isActive ? 0.5 : 0,
                    }}
                    transition={{
                      duration: m.duration(0.45),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
