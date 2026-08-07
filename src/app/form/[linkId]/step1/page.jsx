'use client'

import toast from 'react-hot-toast'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { step1Schema } from '@/application/validation/needAnalysis'
import FormContainer from '@/components/FormContainer'
import FormField from '@/components/FormField'
import FormNavButton from '@/components/FormNavButton'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useFormContext } from '@/context/FormContext'

export default function Form1Page() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const {
    getStepData,
    updateStepData,
    isLoaded,
    linkId,
    apiError,
  } = useFormContext()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      dateOfBirth: null,
      spouseName: '',
      phoneNumber: '',
      address: '',
      numberOfChildren: '',
      childrenAges: '',
      occupation: '',
      monthlyIncome: '',
    },
  })

  useEffect(() => {
    if (apiError) {
      if (apiError.status === 410) {
        router.replace('/form/expired')
      } else if (apiError.status === 404) {
        router.replace('/form/invalid')
      } else {
        toast.error(apiError.message || 'Something went wrong')
      }
    }
  }, [apiError, router])

  useEffect(() => setMounted(true), [])

  const step1Data = getStepData('step1')

  useEffect(() => {
    if (isLoaded && step1Data) {
      const formDataToLoad = {
        ...step1Data,
        dateOfBirth: step1Data.dateOfBirth
          ? new Date(step1Data.dateOfBirth)
          : null,
      }
      reset(formDataToLoad)

      // Add a small delay to ensure form fields are populated before hiding loading
      setTimeout(() => {
        setIsLoadingData(false)
      }, 300)
    } else if (isLoaded && !step1Data) {
      // No existing data, just hide loading
      setIsLoadingData(false)
    }
  }, [isLoaded, step1Data, reset])

  // The date picker swaps between a popover and a full-screen sheet, because
  // an anchored popover is unusable on a narrow screen.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') setOpen(false)
    },
    [setOpen]
  )

  useEffect(() => {
    if (!mounted) return
    if (open) window.addEventListener('keydown', onKeyDown)
    else window.removeEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, mounted, onKeyDown])

  // Takes the errors react-hook-form passes in, rather than reading the `errors`
  // from the render closure — on a first failed submit that closure still holds
  // the previous render's empty object, so no toast fired.
  const handleValidationErrors = (validationErrors) => {
    Object.values(validationErrors).forEach((error) => {
      if (error?.message) toast.error(error.message)
    })
  }

  const onSubmit = async (data) => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      // Age is derived server-side from the date of birth (domain/services/age),
      // so it is no longer smuggled into the submitted payload here.
      const saveResult = await updateStepData('step1', data, true)

      if (!saveResult.success) {
        toast.error(
          saveResult.error || 'Failed to save your details. Please try again.'
        )
        setIsSubmitting(false)
        return
      }

      // Navigate to next step (keep button disabled during navigation)
      router.push(`/form/${linkId}/step2`)
      // Don't reset isSubmitting - let it stay disabled during navigation
    } catch (error) {
      console.error('Error saving step 1:', error)
      toast.error('Failed to save your details. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleStepNavigation = (stepNumber) => {
    router.push(`/form/${linkId}/step${stepNumber}`)
  }

  const calendarProps = {
    mode: 'single',
    fromYear: 1950,
    toYear: new Date().getFullYear(),
    captionLayout: 'dropdown',
    initialFocus: true,
  }

  return (
    <main className="flex min-h-dvh flex-col bg-surface-page">
      <NeedAnalysisFormHeader />
      <ProgressBar
        currentStep={1}
        totalSteps={4}
        onStepClick={handleStepNavigation}
      />

      {isLoadingData ? (
        <section className="flex flex-grow items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-10 text-primary-300" />
            <p className="text-sm text-muted-foreground">Loading form data…</p>
          </div>
        </section>
      ) : (
        <section className="flex flex-grow items-center justify-center px-4 py-8">
          <FormContainer title="Your details">
            <form
              id="step1-form"
              className="grid grid-cols-1 gap-4 text-sm sm:gap-5 md:grid-cols-2"
              onSubmit={handleSubmit(onSubmit, handleValidationErrors)}
            >
              <FormField
                label="Full Name"
                placeholder="Ex: Sunil Nishantha Karunarathna"
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              <FormField
                label="Address"
                placeholder="Your Address"
                error={errors.address?.message}
                {...register('address')}
              />

              {/* Date of Birth */}
              <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        readOnly
                        value={field.value ? format(field.value, 'dd/MM/yyyy') : ''}
                        placeholder="DD/MM/YYYY"
                        aria-invalid={Boolean(errors.dateOfBirth)}
                        className="cursor-pointer pr-11"
                        onClick={() => setOpen(true)}
                      />
                      <Popover open={open && !isMobile} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            aria-label="Open calendar"
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                            onClick={() => setOpen((s) => !s)}
                          >
                            <CalendarIcon className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            {...calendarProps}
                            selected={field.value}
                            onSelect={(d) => {
                              field.onChange(d)
                              setOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {mounted && isMobile && open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                          <div
                            className="absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                          />
                          <div className="relative z-50 rounded-2xl border border-border/70 bg-surface-raised p-3 shadow-xl">
                            <Calendar
                              {...calendarProps}
                              selected={field.value}
                              onSelect={(d) => {
                                field.onChange(d)
                                setOpen(false)
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
              </FormField>

              <FormField
                label="Phone Number"
                placeholder="Ex: +94771234567"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              <FormField
                label="Spouse's Name"
                placeholder="Ex: Samanthi Ishara Karunarathna"
                error={errors.spouseName?.message}
                {...register('spouseName')}
              />

              <FormField
                label="Number of Children"
                placeholder="Ex: 3"
                error={errors.numberOfChildren?.message}
                {...register('numberOfChildren')}
              />

              <FormField
                label="Children's Ages"
                placeholder="Ex: 5, 8, 12"
                error={errors.childrenAges?.message}
                {...register('childrenAges')}
              />

              <FormField
                label="Occupation / Business (Optional)"
                placeholder="Your Job/Business"
                error={errors.occupation?.message}
                {...register('occupation')}
              />

              <FormField
                label="Monthly Income (LKR)"
                placeholder="Ex: 70000"
                error={errors.monthlyIncome?.message}
                className="md:col-span-2 md:mx-auto md:w-full md:max-w-md"
                {...register('monthlyIncome')}
              />
            </form>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-end">
              <FormNavButton
                label={isSubmitting ? 'Saving…' : 'Next'}
                type="next"
                onClick={handleSubmit(onSubmit, handleValidationErrors)}
                disabled={isSubmitting}
              />
            </div>
          </FormContainer>
        </section>
      )}
    </main>
  )
}
