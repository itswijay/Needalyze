'use client'

import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import FormContainer from '@/components/FormContainer'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import FormNavButton from '@/components/FormNavButton'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormContext } from '@/context/FormContext'

export default function Form3Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const handleBack = () => {
    router.push(`/form/${linkId}/step2`)
  }

  // Get form context
  const { getStepData, updateStepData, isLoaded, linkId, getAllData } =
    useFormContext()
  const step3Data = getStepData('step3')

  // Zod validation schema
  const calculationSchema = z.object({
    fixedMonthlyExpenses: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return undefined
        const num = Number(val)
        return isNaN(num) ? undefined : num
      },
      z
        .number({
          required_error: 'Fixed monthly expenses is required',
          invalid_type_error: 'Fixed monthly expenses is required',
        })
        .positive('Fixed monthly expenses must be greater than 0')
        .min(1, 'Fixed monthly expenses must be at least 1')
    ),

    bankInterestRate: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return undefined
        const num = Number(val)
        return isNaN(num) ? undefined : num
      },
      z
        .number({
          required_error: 'Bank interest rate is required',
          invalid_type_error: 'Bank interest rate is required',
        })
        .positive('Bank interest rate must be greater than 0')
        .max(100, 'Bank interest rate cannot exceed 100%')
    ),

    // Optional fields - will be 0 if not provided
    unsecuredBankLoan: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return 0
        const num = Number(val)
        return isNaN(num) ? 0 : num
      },
      z
        .number({
          invalid_type_error: 'Please enter a valid number',
        })
        .nonnegative('Cannot be negative')
    ),

    cashInHandInsurance: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return 0
        const num = Number(val)
        return isNaN(num) ? 0 : num
      },
      z
        .number({
          invalid_type_error: 'Please enter a valid number',
        })
        .nonnegative('Cannot be negative')
    ),
  })

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(calculationSchema),
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
      // Restore calculated values if they exist
      if (step3Data.hlvalue) setHLValue(step3Data.hlvalue)
      if (step3Data.actualHLValue) setActualHLValue(step3Data.actualHLValue)
    }
  }, [isLoaded, step3Data, reset])

  // Real-time HLV calculation
  useEffect(() => {
    // Only calculate if both required fields have valid values
    if (
      fixedMonthlyExpenses &&
      bankInterestRate &&
      !isNaN(fixedMonthlyExpenses) &&
      !isNaN(bankInterestRate) &&
      fixedMonthlyExpenses > 0 &&
      bankInterestRate > 0
    ) {
      // Formula: HLV = (Fixed Monthly Expenses × 12) / (Bank Interest Rate / 100)
      const calculatedHLV =
        (fixedMonthlyExpenses * 12) / (bankInterestRate / 100)

      // Handle edge cases
      if (isFinite(calculatedHLV) && calculatedHLV >= 0) {
        setHLValue(Math.round(calculatedHLV)) // Round to nearest whole number
      } else {
        setHLValue(0)
      }
    } else {
      setHLValue(0)
    }
  }, [fixedMonthlyExpenses, bankInterestRate])

  // Real-time Actual HLV calculation
  useEffect(() => {
    // Formula: Actual HLV = HLV + Unsecured Bank Loan - Cash In Hand + Insurance
    const unsecuredLoan = Number(unsecuredBankLoan) || 0
    const cashInsurance = Number(cashInHandInsurance) || 0

    const calculatedActualHLV = hlvalue + unsecuredLoan - cashInsurance

    // Ensure the result is valid and non-negative
    if (isFinite(calculatedActualHLV) && calculatedActualHLV >= 0) {
      setActualHLValue(Math.round(calculatedActualHLV))
    } else if (calculatedActualHLV < 0) {
      // If negative, show 0 (can't have negative life value)
      setActualHLValue(0)
    } else {
      setActualHLValue(0)
    }
  }, [hlvalue, unsecuredBankLoan, cashInHandInsurance])

  // handle Calculation
  const onSubmit = async (data) => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      // Save form inputs and calculated values to context
      const step3CompleteData = {
        fixedMonthlyExpenses: data.fixedMonthlyExpenses,
        bankInterestRate: data.bankInterestRate,
        unsecuredBankLoan: data.unsecuredBankLoan,
        cashInHandInsurance: data.cashInHandInsurance,
        hlvalue: hlvalue,
        actualHLValue: actualHLValue,
        completed: true,
        completedAt: new Date(),
      }

      await updateStepData('step3', step3CompleteData, true)

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
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar
        currentStep={3}
        totalSteps={4}
        onStepClick={handleStepNavigation}
      />

      <section className="flex-grow flex justify-center items-start py-8 px-4">
        <FormContainer>
          <div className="mb-6">
            <h1 className="font-bold text-2xl text-gray-800">
              Calculation of Life Cover
            </h1>
            <p className="text-neutral-500 text-sm sm:text-base">
              Enter Your Details in the Following Fields
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm"
          >

            {/* Left column - Input fields */}
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {/* Fixed Monthly Expenses */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fixed Monthly Expenses
                </label>
                <input
                  type="number"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                  {...register('fixedMonthlyExpenses', { valueAsNumber: true })}
                />

              </div>

              {/* Bank Interest Rate */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Bank Interest Rate
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                  {...register('bankInterestRate', { valueAsNumber: true })}
                />

              </div>

              {/* HLV - Mobile only */}
              <div className="md:hidden flex flex-col items-center mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  Your Human Life Value
                </label>
                <div className="border border-[#8EABD2] rounded-full px-6 py-2 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-xl sm:text-2xl">
                  {hlvalue}
                </div>
              </div>

              {/* Unsecured Bank Loan */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Unsecured Bank Loan
                </label>
                <input
                  type="number"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                  {...register('unsecuredBankLoan', { valueAsNumber: true })}
                />
              </div>

              {/* Cash In Hand + Insurance */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Cash In Hand + Insurance
                </label>
                <input
                  type="number"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                  {...register('cashInHandInsurance', { valueAsNumber: true })}
                />
              </div>

              {/* Actual HLV - Mobile only */}
              <div className="md:hidden flex flex-col items-center mb-2">
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  Your Actual Human Life Value
                </label>
                <div className="border border-[#8EABD2] rounded-full px-6 py-2 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-xl sm:text-2xl">
                  {actualHLValue}
                </div>
              </div>
            </div>

            {/* Right column - Calculated values (Desktop only) */}
            <div className="hidden md:flex md:flex-col md:justify-around md:items-center">
              {/* HLV - Desktop */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  Your Human Life Value
                </label>
                <div className="border border-[#8EABD2] rounded-full px-6 py-2 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-2xl">
                  {hlvalue}
                </div>
              </div>

              {/* Actual HLV - Desktop */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  Your Actual Human Life Value
                </label>
                <div className="border border-[#8EABD2] rounded-full px-6 py-2 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-2xl">
                  {actualHLValue}
                </div>
              </div>
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="flex flex-row justify-between items-center mt-8 gap-2">
            <FormNavButton
              label="Back"
              type="prev"
              variant="gradient"
              onClick={handleBack}
            />
            <FormNavButton
              label={isSubmitting ? 'Submitting...' : 'Submit'}
              type="next"
              variant="gradient"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={isSubmitting}
            />
          </div>
        </FormContainer>
      </section>
    </main>
  )
}
