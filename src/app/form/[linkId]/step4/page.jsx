'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, RotateCcw } from 'lucide-react'
import { useFormContext } from '@/context/FormContext'

export default function Step4Page() {
  const router = useRouter()
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const { updateStepData, getAllData, linkId } = useFormContext()

  const handleDownload = () => {
    // TODO: Implement PDF generation
    // TODO: Access form data from context or Supabase for PDF generation
    console.log('Download PDF functionality - To be implemented')
  }

  const handleStartOver = () => {
    if (isRestarting) return // Prevent multiple clicks

    setIsRestarting(true)
    router.push(`/form/${linkId}/step1`)
    // Reset form data in context
    ;[
      {
        step: 'step1',
        data: {
          fullName: '',
          dateOfBirth: null,
          spouseName: '',
          phoneNumber: '',
          address: '',
          numberOfChildren: null,
          childrenAges: '',
          occupation: '',
          monthlyIncome: null,
          age: null,
        },
      },
      {
        step: 'step2',
        data: {
          insuranceNeeds: {
            dependentCostOfLiving: false,
            higherEducationChildren: false,
            longTermSavings: false,
            shortTermSavings: false,
            pensionFund: false,
          },
          healthCovers: {
            dailyHospitalizationExpenses: false,
            surgeryCover: false,
            hospitalBillCover: false,
            criticalIllness: false,
          },
        },
      },
      {
        step: 'step3',
        data: { actualHLValue: null, completed: false },
      },
    ].forEach((step) => updateStepData(step.step, step.data, true))
    // Don't reset isRestarting - let it stay disabled during navigation
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={4} totalSteps={4} />

      <section className="flex-grow flex justify-center items-center pb-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl w-full text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-200 via-primary-400 to-primary-700 flex items-center justify-center shadow-xl">
                <CheckCircle2
                  className="w-20 h-20 text-white"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Success Message */}

          <h1 className="text-2xl md:text-xl font-bold text-primary-600 mb-6">
            Form Completed Successfully
          </h1>

          <p className="text-gray-600 mb-8">
            Your need analysis has been completed. You can download it as a PDF
            or fill out the form again from the beginning.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Start New Form Button */}
            <Button
              onClick={handleStartOver}
              className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              variant="outline"
              disabled={isRestarting}
            >
              <RotateCcw className="w-5 h-5" />
              <span>{isRestarting ? 'Starting...' : 'Fill Again'}</span>
            </Button>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              variant="gradient"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
