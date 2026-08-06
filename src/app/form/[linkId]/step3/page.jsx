'use client'

import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import FormContainer from '@/components/FormContainer'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import FormNavButton from '@/components/FormNavButton'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormContext } from '@/context/FormContext'
import { step3Schema } from '@/application/validation/needAnalysis'
import {
  calculateActualHlv,
  calculateHlv,
} from '@/domain/services/humanLifeValue'

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
