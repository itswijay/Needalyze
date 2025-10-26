'use client'

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

export default function Form3Page() {
  const router = useRouter()
  const handleBack = () => router.push('/form/step2')

  // Zod validation schema
  const calculationSchema = z.object({
    fixedMonthlyExpenses: z
      .number({
        required_error: 'Fixed monthly expenses is required',
        invalid_type_error: 'Please enter a valid number',
      })
      .positive('Fixed monthly expenses must be greater than 0')
      .min(1, 'Fixed monthly expenses must be at least 1'),

    bankInterestRate: z
      .number({
        required_error: 'Bank interest rate is required',
        invalid_type_error: 'Please enter a valid number',
      })
      .positive('Bank interest rate must be greater than 0')
      .max(100, 'Bank interest rate cannot exceed 100%')
      .refine((val) => val > 0, {
        message: 'Bank interest rate must be greater than 0',
      }),

    // Optional fields - will be 0 if not provided
    unsecuredBankLoan: z
      .number({
        invalid_type_error: 'Please enter a valid number',
      })
      .nonnegative('Cannot be negative')
      .optional()
      .transform((val) => val ?? 0),

    cashInHandInsurance: z
      .number({
        invalid_type_error: 'Please enter a valid number',
      })
      .nonnegative('Cannot be negative')
      .optional()
      .transform((val) => val ?? 0),
  })

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
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

  const [hlvalue, setHLValue] = useState(0)

  // handle Calculation
  const handleCalculation = async (data) => {
    console.log('Form submission data:', data)

    const fixedExpenses = data.fixedMonthlyExpenses
    const interestRate = data.bankInterestRate
    const unsecuredLoan = data.unsecuredBankLoan
    const cashInsurance = data.cashInHandInsurance
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={3} totalSteps={4} />

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

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm">
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
                {errors.fixedMonthlyExpenses && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.fixedMonthlyExpenses.message}
                  </p>
                )}
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
                {errors.bankInterestRate && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.bankInterestRate.message}
                  </p>
                )}
              </div>

              {/* HLV - Mobile only */}
              <div className="md:hidden flex flex-col items-center my-2">
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
              <div className="md:hidden flex flex-col items-center my-2">
                <label className="block text-gray-700 font-medium mb-2 text-center">
                  Your Actual Human Life Value
                </label>
                <div className="border border-[#8EABD2] rounded-full px-6 py-2 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-xl sm:text-2xl">
                  {hlvalue}
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
                  {hlvalue}
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
            <Button
              className="rounded-full w-30 h-11 hover:scale-103 active:scale-95"
              variant="gradient"
              onClick={handleSubmit(handleCalculation)}
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      </section>
    </main>
  )
}
