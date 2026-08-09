'use client'

import React, { useEffect, useState } from 'react'

import FormContainer from '@/components/FormContainer'
import FormField from '@/components/FormField'
import FormNavButton from '@/components/FormNavButton'
import { AnimatedNumber } from '@/components/ui/motion-primitives'
import { step3Schema } from '@/application/validation/needAnalysis'
import {
  calculateActualHlv,
  calculateHlv,
} from '@/domain/services/humanLifeValue'
import { formatCurrency } from '@/domain/services/money'
import { cn } from '@/lib/utils'

import { toastValidationErrors, useStepForm } from './stepForm'

const DEFAULT_VALUES = {
  fixedMonthlyExpenses: '',
  bankInterestRate: '',
  unsecuredBankLoan: '',
  cashInHandInsurance: '',
}

const hydrate = (data) => ({
  fixedMonthlyExpenses: data.fixedMonthlyExpenses ?? '',
  bankInterestRate: data.bankInterestRate ?? '',
  unsecuredBankLoan: data.unsecuredBankLoan ?? '',
  cashInHandInsurance: data.cashInHandInsurance ?? '',
})

export default function CalculatorStep({ onSubmit, onBack, isSubmitting }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useStepForm({
    step: 'step3',
    schema: step3Schema,
    defaultValues: DEFAULT_VALUES,
    hydrate,
  })

  // Watch form values for real-time calculation
  const fixedMonthlyExpenses = watch('fixedMonthlyExpenses')
  const bankInterestRate = watch('bankInterestRate')
  const unsecuredBankLoan = watch('unsecuredBankLoan')
  const cashInHandInsurance = watch('cashInHandInsurance')

  const [hlvalue, setHLValue] = useState(0)
  const [actualHLValue, setActualHLValue] = useState(0)

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

  const submit = handleSubmit(onSubmit, toastValidationErrors)

  return (
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
        onSubmit={submit}
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

      <div className="mt-8 flex flex-row items-center justify-between gap-2">
        <FormNavButton label="Back" type="prev" onClick={onBack} />
        <FormNavButton
          label={isSubmitting ? 'Submitting…' : 'Submit'}
          type="next"
          onClick={submit}
          disabled={isSubmitting}
        />
      </div>
    </FormContainer>
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
