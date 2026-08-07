'use client'

import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import FormContainer from '@/components/FormContainer'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import FormField from '@/components/FormField'
import FormNavButton from '@/components/FormNavButton'
import { AnimatedNumber } from '@/components/ui/motion-primitives'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormContext } from '@/context/FormContext'
import { step3Schema } from '@/application/validation/needAnalysis'
import {
  calculateActualHlv,
  calculateHlv,
} from '@/domain/services/humanLifeValue'
import { formatCurrency } from '@/domain/services/money'
import { cn } from '@/lib/utils'

export default function Form3Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleBack = () => {
    router.push(`/form/${linkId}/step2`)
  }

  // Get form context
  const { getStepData, updateStepData, isLoaded, linkId } = useFormContext()
  const step3Data = getStepData('step3')

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
    defaultValues: {
      fixedMonthlyExpenses: '',
      bankInterestRate: '',
      unsecuredBankLoan: '',
      cashInHandInsurance: '',
    },
  })

  // Watch form values for real-time calculation
  const fixedMonthlyExpenses = watch('fixedMonthlyExpenses')
  const bankInterestRate = watch('bankInterestRate')
  const unsecuredBankLoan = watch('unsecuredBankLoan')
  const cashInHandInsurance = watch('cashInHandInsurance')

  const [hlvalue, setHLValue] = useState(0)
  const [actualHLValue, setActualHLValue] = useState(0)

  // Load data from context when available
  useEffect(() => {
    if (isLoaded && step3Data) {
      reset({
        fixedMonthlyExpenses: step3Data.fixedMonthlyExpenses || '',
        bankInterestRate: step3Data.bankInterestRate || '',
        unsecuredBankLoan: step3Data.unsecuredBankLoan || '',
        cashInHandInsurance: step3Data.cashInHandInsurance || '',
      })
      // Show the saved total. The four inputs above are blank after a reload —
      // the table stores only this figure, never the numbers behind it.
      if (step3Data.humanLifeValue) setActualHLValue(step3Data.humanLifeValue)
    }
  }, [isLoaded, step3Data, reset])

  // Live preview of the two figures. The formulas live in the domain layer, so
  // this shows exactly what the server will compute and store on submit.
  useEffect(() => {
    setHLValue(calculateHlv({ fixedMonthlyExpenses, bankInterestRate }))
  }, [fixedMonthlyExpenses, bankInterestRate])

  useEffect(() => {
    setActualHLValue(
      calculateActualHlv({
        hlv: hlvalue,
        unsecuredBankLoan,
        cashInHandInsurance,
      })
    )
  }, [hlvalue, unsecuredBankLoan, cashInHandInsurance])

  // handle Calculation
  const onSubmit = async (data) => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      // Only the customer's inputs are sent. The server recomputes the life
      // cover from them rather than trusting a total posted by the browser.
      const saveResult = await updateStepData('step3', data, true)

      if (!saveResult.success) {
        toast.error(
          saveResult.error || 'Failed to save your details. Please try again.'
        )
        setIsSubmitting(false)
        return
      }

      // Navigate to final step (keep button disabled during navigation)
      router.push(`/form/${linkId}/step4`)
      // Don't reset isSubmitting - let it stay disabled during navigation
    } catch (error) {
      console.error('Error marking form as complete:', error)
      // Only reset on error
      setIsSubmitting(false)
    }
  };

  const onError = (errors) => {
  if (errors.fixedMonthlyExpenses) {
    toast.error(errors.fixedMonthlyExpenses.message);
    return;
  }

  if (errors.bankInterestRate) {
    toast.error(errors.bankInterestRate.message);
    return;
  }

  if (errors.unsecuredBankLoan) {
    toast.error(errors.unsecuredBankLoan.message);
    return;
  }

  if (errors.cashInHandInsurance) {
    toast.error(errors.cashInHandInsurance.message);
    return;
  }
};

  const handleStepNavigation = (stepNumber) => {
    // Navigate to the selected step
    router.push(`/form/${linkId}/step${stepNumber}`)
  }

  return (
    <main className="flex min-h-dvh flex-col bg-surface-page">
      <NeedAnalysisFormHeader />
      <ProgressBar
        currentStep={3}
        totalSteps={4}
        onStepClick={handleStepNavigation}
      />

      <section className="flex flex-grow items-start justify-center px-4 py-8">
        <FormContainer>
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Calculation of Life Cover
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Enter your details in the following fields
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2"
          >
            {/* Left column - Input fields */}
            <div className="flex flex-col space-y-4">
              <FormField
                label="Fixed Monthly Expenses"
                type="number"
                error={errors.fixedMonthlyExpenses?.message}
                {...register('fixedMonthlyExpenses', { valueAsNumber: true })}
              />

              <FormField
                label="Bank Interest Rate"
                type="number"
                step="0.1"
                error={errors.bankInterestRate?.message}
                {...register('bankInterestRate', { valueAsNumber: true })}
              />

              <FormField
                label="Unsecured Bank Loan"
                type="number"
                placeholder="optional"
                error={errors.unsecuredBankLoan?.message}
                {...register('unsecuredBankLoan', { valueAsNumber: true })}
              />

              <FormField
                label="Cash In Hand + Insurance"
                type="number"
                placeholder="optional"
                error={errors.cashInHandInsurance?.message}
                {...register('cashInHandInsurance', { valueAsNumber: true })}
              />
            </div>

            {/* Right column - the two calculated figures. These used to be
                written out twice, once in a md:hidden block interleaved with
                the inputs and once in a hidden md:flex column. */}
            <div className="flex flex-col justify-center gap-6">
              <ValueReadout label="Your Human Life Value" value={hlvalue} />
              <ValueReadout
                label="Your Actual Human Life Value"
                value={actualHLValue}
                emphasis
              />
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="mt-8 flex flex-row items-center justify-between gap-2">
            <FormNavButton label="Back" type="prev" onClick={handleBack} />
            <FormNavButton
              label={isSubmitting ? 'Submitting…' : 'Submit'}
              type="next"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={isSubmitting}
            />
          </div>
        </FormContainer>
      </section>
    </main>
  )
}

/**
 * One of the two calculated figures.
 *
 * The value counts to its new total instead of jumping, which matters here:
 * these update on every keystroke in the fields beside them, and a number
 * that animates makes the cause and effect legible. It also runs through
 * formatCurrency now — these were the only place in the app still printing a
 * raw ungrouped integer.
 */
function ValueReadout({ label, value, emphasis = false }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 block text-center text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <div
        className={cn(
          'flex w-full max-w-xs items-center justify-center rounded-2xl border px-6 py-3 text-center font-bold',
          emphasis
            ? 'border-primary-400 bg-gradient-brand-horizontal text-white shadow-md'
            : 'border-border bg-surface-sunken text-foreground'
        )}
      >
        <AnimatedNumber
          value={value}
          format={(n) => formatCurrency(Math.round(n)) || 'Rs. 0'}
          startOnView={false}
          className="text-lg sm:text-xl"
        />
      </div>
    </div>
  )
}
