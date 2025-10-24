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


  //Zod validation schema
  const calculationSchema = z.object({
      fixedMonthlyExpenses : z
          .number()
          .min(0, 'fixed monthly expenses is required'),
      bankInterestRate : z
          .number()
          .min(0, 'bank interest rate is required'),
      
      //====== optional =========    
      unsecuredBankLoan : z.number().optional(),
      cashInHandInsurance : z.number().optional()
                  
  })

  // React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver : zodResolver(calculationSchema),
    mode: 'onSubmit',
    defaultValues:{
      fixedMonthlyExpenses: null,
      bankInterestRate: null,
      unsecuredBankLoan:null,
      cashInHandInsurance: null 
    },
  });


  const [isMobile, setIsMobile] = useState(false)
  const [hlvalue, setHLValue] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])



  // handle Calculation
  const handleCalculation = async (data) =>{

    console.log('Form submission data:', data)

    const fixedExpenses = data.fixedMonthlyExpenses;
    const interestRate = data.bankInterestRate;
    const unsecuredLoan = data.unsecuredBankLoan;
    const cashInsurance = data.cashInHandInsurance;

  }
  
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile view */}

      {isMobile ? (
        <div>
          <NeedAnalysisFormHeader />
          <ProgressBar currentStep={3} totalSteps={4} />

          <section className="flex-grow flex justify-center items-start py-6 px-4">
            <FormContainer>
              <div className="mb-6">
                <p className="font-bold text-2xl">Calculation of Life Cover</p>
                <p className="text-neutral-500">
                  Enter Your Details in the Following Fields
                </p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
                {/* Left column */}
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Fixed Monthly Expenses
                    </label>
                    <input
                      type="number"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("fixedMonthlyExpenses",{ valueAsNumber : true })}
                    />{errors.fixedMonthlyExpenses && (
                      <p className='text-red-600 text-xs mt-1 ml-4'>{errors.fixedMonthlyExpenses.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Bank Interest Rate
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("bankInterestRate",{valueAsNumber : true})}
                    />{errors.bankInterestRate && (
                      <p className='text-red-600 text-xs mt-1 ml-4'>{errors.bankInterestRate.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="block text-gray-700 font-medium mb-1">
                      Your Human Life Value
                    </label>
                    <div className="border border-[#8EABD2] rounded-full px-4 py-1 bg-[#7792b7] w-56 text-white flex items-center justify-center font-bold text-xl">
                      {hlvalue}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Unsecured Bank Loan
                    </label>
                    <input
                      type="number"
                      placeholder="optional"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("unsecuredBankLoan",{valueAsNumber : true})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Cash In Hand + Insurance
                    </label>
                    <input
                      type="number"
                      placeholder="optional"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("cashInHandInsurance",{valueAsNumber : true})}
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="block text-gray-700 font-medium mb-1">
                      Your Actual Human Life Value
                    </label>
                    <div className="border border-[#8EABD2] rounded-full px-4 py-1 bg-[#7792b7] w-56 text-white flex items-center justify-center font-bold text-xl">
                      {hlvalue}
                    </div>
                  </div>
                </div>
              </form>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 gap-2 sm:gap-0">
                <FormNavButton
                  label="Back"
                  type="prev"
                  variant="gradient"
                  onClick={handleBack}
                />
                <Button
                  className="rounded-full w-30 h-11 flex items-center justify-center text-center hover:scale-103 active:scale-95"
                  variant="gradient"
                  type="submit"
                  onClick={handleSubmit(handleCalculation)}
                >
                  Submit  
                </Button>
              </div>
            </FormContainer>
          </section>
        </div>
      ) : (
        // desktop view

        <div>
          <NeedAnalysisFormHeader />
          <ProgressBar currentStep={3} totalSteps={4} />

          <section className="flex-grow flex justify-center items-start py-6 px-4">
            <FormContainer>
              <div className="mb-6">
                <p className="font-bold text-2xl">Calculation of Life Cover</p>
                <p className="text-neutral-500">
                  Enter Your Details in the Following Fields
                </p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
                {/* Left column */}
                <div className="flex flex-col space-y-4">
                  <div className="order-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Fixed Monthly Expenses
                    </label>
                    <input
                      type="number"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("fixedMonthlyExpenses",{ valueAsNumber : true })}
                    />{errors.fixedMonthlyExpenses && (
                      <p className='text-red-600 text-xs mt-1 ml-4'>{errors.fixedMonthlyExpenses.message}</p>
                    )}
                  </div>

                  <div className="order-2">
                    <label className="block text-gray-700 font-medium mb-1">
                      Bank Interest Rate
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("bankInterestRate",{valueAsNumber : true})}
                      />{errors.bankInterestRate && (
                      <p className='text-red-600 text-xs mt-1 ml-4'>{errors.bankInterestRate.message}</p>
                    )}
                  </div>

                  <div className="order-4 md:order-3">
                    <label className="block text-gray-700 font-medium mb-1">
                      Unsecured Bank Loan
                    </label>
                    <input
                      type="number"
                      placeholder="optional"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("unsecuredBankLoan",{valueAsNumber : true})}
                    />
                  </div>

                  <div className="order-5 md:order-4">
                    <label className="block text-gray-700 font-medium mb-1">
                      Cash In Hand + Insurance
                    </label>
                    <input
                      type="number"
                      placeholder="optional"
                      className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                      {...register("cashInHandInsurance",{valueAsNumber : true})}
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col space-y-4 mt-7 items-center">
                  <div className="order-2 md:order-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Your Human Life Value
                    </label>
                    <div className="border border-[#8EABD2] rounded-full px-4 py-1 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-2xl">
                      {hlvalue}
                    </div>
                  </div>

                  <div className="order-2 md:order-2 mt-20">
                    <label className="block text-gray-700 font-medium">
                      Your Actual Human Life Value
                    </label>
                    <div className="border border-[#8EABD2] rounded-full px-4 py-1 bg-[#7792b7] w-64 text-white flex items-center justify-center font-bold text-2xl">
                      {hlvalue}
                    </div>
                  </div>
                </div>
              </form>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-2 sm:gap-0">
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
        </div>
      )}
    </main>
  )
}
