'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Download, RotateCcw } from 'lucide-react'
import { useFormContext } from '@/context/FormContext'

export default function Step4Page() {
  const router = useRouter()
  const { getAllData, resetForm } = useFormContext()

  // Get all form data for future use (PDF generation, Supabase submission, etc.)
  const allFormData = getAllData()

  const handleDownload = () => {
    // TODO: Implement PDF generation with form data
    // Access complete form data via: allFormData
    console.log('Complete Form Data for PDF:', allFormData)
    console.log('Download PDF functionality - To be implemented')
  }

  const handleStartNewForm = () => {
    // Clear all form data and localStorage
    resetForm()
    // Navigate back to step 1
    router.push('/form/step1')
  }

  // TODO: Future Supabase Integration
  // When implementing Supabase, submit data here or in Step 3
  // Example:
  // useEffect(() => {
  //   const submitToSupabase = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from('form_submissions')
  //         .insert([allFormData])
  //       if (error) throw error
  //       console.log('Data submitted successfully:', data)
  //     } catch (error) {
  //       console.error('Error submitting to Supabase:', error)
  //     }
  //   }
  //   submitToSupabase()
  // }, [])

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
            Your need analysis form has been saved. You can download it as a PDF
            or start a new form.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              variant="gradient"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </Button>

            {/* Start New Form Button */}
            <Button
              onClick={handleStartNewForm}
              className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              variant="outline"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start New Form</span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
