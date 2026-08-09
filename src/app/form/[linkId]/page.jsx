'use client'

import toast from 'react-hot-toast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/context/FormContext'
import {
  step1Schema,
  step2Schema,
} from '@/application/validation/needAnalysis'
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

const TOTAL_STEPS = 4

function stepFromLocation() {
  const value = Number(new URLSearchParams(window.location.search).get('step'))
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_STEPS
    ? value
    : 1
}

export default function NeedAnalysisFormPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { formData, updateStepData, isLoaded, apiError } = useFormContext()

  // Read the step from the URL after mount rather than during render: the
  // server has no query string, so seeding state from it would disagree with
  // the server-rendered markup and break hydration.
  useEffect(() => {
    setStep(stepFromLocation())
  }, [])

  useEffect(() => {
    const onPopState = () => setStep(stepFromLocation())
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

  /**
   * How far the draft actually entitles the customer to go.
   *
   * Derived from the same schemas the steps submit against, so a step counts
   * as done only if the data behind it would still pass. Without this, a
   * deep link to step 3 rendered a blank calculator — and ProgressBar, which
   * infers completion from the current step alone, drew ticks against steps
   * that had never been filled in.
   */
  const maxStep = useMemo(() => {
    if (!step1Schema.safeParse(formData.step1).success) return 1
    if (!step2Schema.safeParse(formData.step2).success) return 2
    return formData.step4.completed ? TOTAL_STEPS : 3
  }, [formData])

  const currentStep = Math.min(step, maxStep)

  const goTo = useCallback((next) => {
    setStep(next)
    const { pathname } = window.location
    window.history.pushState(null, '', next === 1 ? pathname : `${pathname}?step=${next}`)
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

        goTo(next)
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

          {currentStep === 4 && <SuccessScreen onRestart={() => goTo(1)} />}
        </section>
      )}
    </main>
  )
}
