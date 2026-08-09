'use client'

import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/context/FormContext'
import { useNeedAnalysisPdf } from '@/hooks/useNeedAnalysisPdf'
import { useMotion } from '@/lib/motion'

export default function SuccessScreen({ onRestart }) {
  const [isRestarting, setIsRestarting] = useState(false)
  const { resetForm, getAllData, linkId } = useFormContext()
  const { generate, isGenerating: isGeneratingPDF } = useNeedAnalysisPdf(linkId)
  const m = useMotion()

  useEffect(() => {
    toast.success('Form submitted successfully!', {
      id: 'form-success',
    })
  }, [])

  const handleDownload = async () => {
    try {
      const result = await generate(getAllData())
      if (!result) return // already generating

      if (result.storageError) {
        console.warn('Storage upload failed:', result.storageError)
        toast.error(
          `PDF downloaded locally, but cloud upload failed: ${result.storageError}`
        )
      } else if (result.url) {
        toast.success(`PDF generated and saved to cloud: ${result.filename}`)
      } else {
        toast.success(`PDF downloaded successfully: ${result.filename}`)
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  const handleStartOver = async () => {
    if (isRestarting) return // Prevent multiple clicks

    setIsRestarting(true)

    try {
      // One intent, one call. This used to post four blank steps in parallel,
      // which wrote a half-empty row and raced the navigation to step 1.
      const result = await resetForm()

      if (!result.success) {
        toast.error(result.error || 'Failed to reset the form. Please try again.')
        setIsRestarting(false)
        return
      }

      onRestart()
    } catch (error) {
      console.error('Error resetting form:', error)
      toast.error('Failed to reset the form. Please try again.')
      setIsRestarting(false)
    }
  }

  return (
    <motion.div
      variants={m.stagger(0.1, 0.15)}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl rounded-3xl border border-border bg-surface-raised p-8 text-center shadow-lg md:p-12"
    >
        {/* Success mark */}
        <motion.div variants={m.scaleIn} className="mb-6 flex justify-center">
          <div className="relative">
            {/* A single ring that expands and fades, rather than a looping
                pulse — this is a one-time arrival, not an ongoing state. */}
            {!m.reduce && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary-200/40"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
              />
            )}
            <div className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary-200 via-primary-400 to-primary-700 shadow-xl md:size-32">
              <motion.svg
                viewBox="0 0 52 52"
                fill="none"
                className="size-16 text-white md:size-20"
              >
                <motion.path
                  d="M14 27 L22 35 L38 18"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: m.reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: m.duration(0.5),
                    delay: m.duration(0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={m.fadeInUp}
          className="mb-3 text-2xl font-bold tracking-tight text-brand-foreground"
        >
          Form Completed Successfully
        </motion.h1>

        <motion.p variants={m.fadeInUp} className="mb-8 text-muted-foreground">
          Your need analysis has been completed. You can download it as a PDF
          or fill out the form again from the beginning.
        </motion.p>

        <motion.div
          variants={m.fadeInUp}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            type="button"
            onClick={handleStartOver}
            variant="outline"
            size="lg"
            disabled={isRestarting}
            className="w-full sm:w-auto"
          >
            {isRestarting ? (
              <Spinner className="size-4" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            {isRestarting ? 'Starting…' : 'Fill Again'}
          </Button>

          <Button
            type="button"
            onClick={handleDownload}
            variant="gradient"
            size="lg"
            disabled={isGeneratingPDF}
            className="w-full sm:w-auto"
          >
            {isGeneratingPDF ? (
              <Spinner className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
            {isGeneratingPDF ? 'Generating PDF…' : 'Download PDF'}
          </Button>
        </motion.div>
      </motion.div>
  )
}
