'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download } from 'lucide-react'

export default function Step4Page() {
  const router = useRouter()

  const handleDownload = () => {
    // TODO: Implement PDF generation
    // TODO: Access form data from context or Supabase for PDF generation
    console.log('Download PDF functionality - To be implemented')
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
          <h1 className="text-2xl md:text-xl font-bold text-primary-600 mb-20">
            Form Completed Successfully
          </h1>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            variant="gradient"
          >
            <Download className="w-5 h-5" />
            <span>Click to Download Your Form</span>
          </Button>
        </div>
      </section>
    </main>
  )
}
