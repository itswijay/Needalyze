'use client'

import toast from 'react-hot-toast'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/context/FormContext'
import {
  TOTAL_STEPS,
  furthestReachableStep,
} from '@/application/view-models/needAnalysisDraft'
import { cn } from '@/lib/utils'

import CalculatorStep from './steps/CalculatorStep'
import CoverageStep from './steps/CoverageStep'
import PersonalDetailsStep from './steps/PersonalDetailsStep'
import SuccessScreen from './steps/SuccessScreen'

/**
 * The customer's need-analysis form.
 *
 * This was four routes — one per step — each carrying its own copy of the
 * page chrome, its own save-and-navigate handler and its own step navigation.
 * The duplication was not the only cost: the expired-link guard and the
 * loading gate existed in step 1 alone, so landing on any other step with a
 * dead link rendered a silently broken form, and nothing stopped a customer
 * deep-linking past steps they had not filled in.
 *
 * Step is state here, so each of those is written once. It is mirrored to
 * `?step=N` purely so the browser Back button still moves between steps
 * rather than leaving the form.
 */

/** @returns {number | null} null when the URL does not name a usable step */
function stepFromLocation() {
  const raw = new URLSearchParams(window.location.search).get('step')
  if (raw === null) return null

  const value = Number(raw)
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_STEPS
    ? value
    : null
}

export default function NeedAnalysisFormPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Whether step 4 was reached by submitting just now, as opposed to being
  // where this visit resumed. Only the former is worth announcing.
  const [justSubmitted, setJustSubmitted] = useState(false)

  const { formData, updateStepData, isLoaded, apiError } = useFormContext()

  // Whether the opening step has been decided yet — by the URL, or by how far
  // the loaded draft got. Either way it happens once.
  const placed = useRef(false)

  // Read the step from the URL after mount rather than during render: the
  // server has no query string, so seeding state from it would disagree with
  // the server-rendered markup and break hydration.
  useEffect(() => {
    const fromUrl = stepFromLocation()
    if (fromUrl === null) return

    placed.current = true
    setStep(fromUrl)
  }, [])

  useEffect(() => {
    const onPopState = () => setStep(stepFromLocation() ?? 1)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!apiError) return

    if (apiError.status === 410) {
      router.replace('/form/expired')
    } else if (apiError.status === 404) {
      router.replace('/form/invalid')
    } else {
      toast.error(apiError.message || 'Something went wrong')
    }
  }, [apiError, router])

  const maxStep = useMemo(() => furthestReachableStep(formData), [formData])

  /**
   * Reopen where the customer left off.
   *
   * The link an advisor shares carries no step, so without this every return
   * visit started at step 1 — and since the progress bar only walks backwards,
   * someone who had already finished was stranded there, unable to reach the
   * report they came back for.
   */
  useEffect(() => {
    if (!isLoaded || placed.current) return

    placed.current = true
    if (maxStep === 1) return

    setStep(maxStep)
    // replace, not push: resuming is where the visit begins, so Back should
    // leave the form rather than return to a step they never chose.
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?step=${maxStep}`
    )
  }, [isLoaded, maxStep])

  const currentStep = Math.min(step, maxStep)

  const goTo = useCallback((next, { celebrate = false } = {}) => {
    setJustSubmitted(celebrate)
    setStep(next)
    const { pathname } = window.location
    window.history.pushState(
      null,
      '',
      next === 1 ? pathname : `${pathname}?step=${next}`
    )
    window.scrollTo({ top: 0 })
  }, [])

  /**
   * Save a step, then advance only if it saved.
   *
   * The three copies this replaces drifted: step 2's catch navigated forward
   * on failure, so a customer whose save had just failed was moved on
   * believing their answers were stored.
   */
  const saveAndAdvance = useCallback(
    async (stepKey, data, next) => {
      if (isSubmitting) return

      setIsSubmitting(true)

      try {
        const result = await updateStepData(stepKey, data, true)

        if (!result.success) {
          toast.error(
            result.error || 'Failed to save your details. Please try again.'
          )
          return
        }

        goTo(next, { celebrate: next === TOTAL_STEPS })
      } catch (error) {
        console.error(`Error saving ${stepKey}:`, error)
        toast.error('Failed to save your details. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, updateStepData, goTo]
  )

  return (
    <main className="flex min-h-dvh flex-col bg-surface-page">
      <NeedAnalysisFormHeader />
      <ProgressBar
        currentStep={currentStep}
        maxStep={maxStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={goTo}
      />

      {!isLoaded ? (
        <section className="flex flex-grow items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-10 text-brand-foreground" />
            <p className="text-sm text-muted-foreground">Loading form data…</p>
          </div>
        </section>
      ) : (
        <section
          className={cn(
            'flex flex-grow justify-center px-4 py-8',
            // Steps 2 and 3 are tall enough to want the top of the viewport;
            // the other two read better centred.
            currentStep === 2 || currentStep === 3
              ? 'items-start'
              : 'items-center'
          )}
        >
          {currentStep === 1 && (
            <PersonalDetailsStep
              isSubmitting={isSubmitting}
              onSubmit={(data) => saveAndAdvance('step1', data, 2)}
            />
          )}

          {currentStep === 2 && (
            <CoverageStep
              isSubmitting={isSubmitting}
              onBack={() => goTo(1)}
              onSubmit={(data) => saveAndAdvance('step2', data, 3)}
            />
          )}

          {currentStep === 3 && (
            <CalculatorStep
              isSubmitting={isSubmitting}
              onBack={() => goTo(2)}
              onSubmit={(data) => saveAndAdvance('step3', data, 4)}
            />
          )}

          {currentStep === 4 && (
            <SuccessScreen
              announce={justSubmitted}
              onRestart={() => goTo(1)}
            />
          )}
        </section>
      )}
    </main>
  )
}
