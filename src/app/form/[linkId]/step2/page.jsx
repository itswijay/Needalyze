'use client'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader'
import ProgressBar from '@/components/ProgressBar'
import FormContainer from '@/components/FormContainer'
import FormNavButton from '@/components/FormNavButton'
import { useFormContext } from '@/context/FormContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { step2Schema } from '@/application/validation/needAnalysis'
import { useMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  emptySelection,
  findHealthCoverConflict,
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
} from '@/domain/constants/needCategories'

export default function NeedAnalysisFormPage2() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get form context
  const { getStepData, updateStepData, isLoaded, linkId } = useFormContext()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      insuranceNeeds: emptySelection(INSURANCE_NEED_KEYS),
      healthCovers: emptySelection(HEALTH_COVER_KEYS),
    },
    mode: 'onChange',
  })

  const step2Data = getStepData('step2')

  // Load data from context when available
  useEffect(() => {
    if (isLoaded && step2Data) {
      reset(step2Data)
    }
  }, [isLoaded, step2Data, reset])

  const watchedValues = watch()

  const handleInsuranceNeedChange = (field, currentValue) => {
    const newValue = !currentValue
    setValue(`insuranceNeeds.${field}`, newValue, { shouldValidate: true })
  }

  const handleHealthCoverChange = (field, currentValue) => {
    const newValue = !currentValue

    // Turning a cover on must not create a conflicting pair. The pairs
    // themselves are declared in domain/constants/needCategories, alongside the
    // schema rule that enforces the same thing on submit.
    if (newValue) {
      const wouldConflict = findHealthCoverConflict({
        ...watchedValues.healthCovers,
        [field]: true,
      })

      if (wouldConflict) {
        toast.error(
          'You cannot select Hospital Bill Cover and Surgery Cover together'
        )
        return
      }
    }

    setValue(`healthCovers.${field}`, newValue, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)

    try {
      // Save to both localStorage and database
      const saveResult = await updateStepData('step2', data, true)

      if (!saveResult.success) {
        toast.error(
          saveResult.error || 'Failed to save your details. Please try again.'
        )
        setIsSubmitting(false)
        return
      }

      // Navigate to next step (keep button disabled during navigation)
      router.push(`/form/${linkId}/step3`)
      // Don't reset isSubmitting - let it stay disabled during navigation
    } catch (error) {
      console.error('Error saving step 2:', error)
      // Only reset on error, but still navigate
      setIsSubmitting(false)
      router.push(`/form/${linkId}/step3`)
    }
  }

  const handleBack = () => {
    router.push(`/form/${linkId}/step1`)
  }

  const handleValidationErrors = (validationErrors) => {
    Object.values(validationErrors).forEach((error) => {
      if (error?.message) toast.error(error.message)
    })
  }

  const handleNext = () => {
    const insuranceSelected = Object.values(
      watchedValues.insuranceNeeds || {}
    ).some(Boolean)
    const healthSelected = Object.values(watchedValues.healthCovers || {}).some(
      Boolean
    )

    if (!insuranceSelected && !healthSelected) {
      toast.error('Select at least one option to continue')
      return
    }

    // An object-level refine lands on the field itself. This used to look at
    // `errors.healthCovers._errors[0]`, which is the shape of ZodError.format()
    // rather than react-hook-form's error tree, so the "only 3 options" rule
    // never surfaced — and the submit below ran without an error callback, so
    // the button simply did nothing.
    if (errors.healthCovers?.message) {
      toast.error(errors.healthCovers.message)
      return
    }

    handleSubmit(onSubmit, handleValidationErrors)()
  }


  const handleStepNavigation = (stepNumber) => {
    // Navigate to the selected step
    router.push(`/form/${linkId}/step${stepNumber}`)
  }

  return (
    <main className="flex min-h-dvh flex-col bg-surface-page">
      <NeedAnalysisFormHeader />
      <ProgressBar
        currentStep={2}
        totalSteps={4}
        onStepClick={handleStepNavigation}
      />

      <section className="flex flex-grow items-start justify-center px-4 py-8">
        <FormContainer>
          <div>


            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:gap-6">
              {/* Insurance Need Section */}
              <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-md sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-base font-semibold">
                    Insurance Need
                  </h2>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* Stays a circle while other icon controls moved to the
                          control tier: the round form is part of how an "i"
                          marker reads, and at 24px a rounded square would just
                          look like a small button. */}
                      <button
                        type="button"
                        aria-label="More information"
                        className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary-200 text-white transition-colors hover:bg-primary-300"
                      >
                        <Info className="size-3.5" strokeWidth={2.5} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg">
                      <AlertDialogHeader className="space-y-2 text-center sm:text-left">
                        <AlertDialogTitle className="text-lg font-semibold sm:text-xl">
                          Insurance Need Information
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed">
                          Select one or more options from the available choices
                          to proceed with your insurance needs assessment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogAction asChild>
                        <Button variant="gradient" className="mt-4 w-full sm:w-auto">
                          OK
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-3">
                  <Controller
                    name="insuranceNeeds.dependentCostOfLiving"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Dependent Cost of Living"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange(
                            'dependentCostOfLiving',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.higherEducationChildren"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Higher Education of Children"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange(
                            'higherEducationChildren',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.longTermSavings"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Long Term Savings"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange(
                            'longTermSavings',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.shortTermSavings"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Short Term Savings"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange(
                            'shortTermSavings',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.pensionFund"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Pension Fund"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange('pensionFund', field.value)
                        }
                      />
                    )}
                  />
                </div>
              </div>

              {/* Health Covers Section */}
              <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-md sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-base font-semibold">
                    Health Covers
                  </h2>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* Stays a circle while other icon controls moved to the
                          control tier: the round form is part of how an "i"
                          marker reads, and at 24px a rounded square would just
                          look like a small button. */}
                      <button
                        type="button"
                        aria-label="More information"
                        className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary-200 text-white transition-colors hover:bg-primary-300"
                      >
                        <Info className="size-3.5" strokeWidth={2.5} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg">
                      <AlertDialogHeader className="space-y-2 text-center sm:text-left">
                        <AlertDialogTitle className="text-lg font-semibold sm:text-xl">
                          Health Covers Information
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2 text-sm leading-relaxed">
                          <span className="block">
                            You can choose a maximum of 3 options from the
                            available health cover choices.
                          </span>
                          <span className="block font-medium text-destructive">
                            Note: Cannot select both Hospital Bill Cover and
                            Surgery Cover at the same time.
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogAction asChild>
                        <Button variant="gradient" className="mt-4 w-full sm:w-auto">
                          OK
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>


                <div className="space-y-3">
                  <Controller
                    name="healthCovers.dailyHospitalizationExpenses"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Daily Hospitalization Expenses"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange(
                            'dailyHospitalizationExpenses',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.surgeryCover"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Surgery Cover"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange('surgeryCover', field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.hospitalBillCover"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Hospital Bill Cover"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange(
                            'hospitalBillCover',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.criticalIllness"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Critical Illness"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange(
                            'criticalIllness',
                            field.value
                          )
                        }
                      />
                    )}
                  />
                </div>

              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex w-full flex-row items-center justify-between">
              <FormNavButton label="Back" type="prev" onClick={handleBack} />
              <FormNavButton
                label="Next"
                type="next"
                onClick={handleNext}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </FormContainer>
      </section>
    </main>
  )
}

// Checkbox Card Component
function CheckboxCard({ label, checked, onChange, disabled = false }) {
  const m = useMotion()

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      role="checkbox"
      aria-checked={checked}
      whileHover={disabled || m.reduce ? undefined : { scale: 1.02 }}
      whileTap={disabled || m.reduce ? undefined : { scale: 0.98 }}
      className={cn(
        'flex w-full items-center rounded-xl border px-3 py-2.5 text-left shadow-sm sm:px-4 sm:py-3',
        'transition-[background-color,border-color,box-shadow] duration-200',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:shadow-md',
        checked
          ? 'border-primary-300 bg-accent/60'
          : 'border-border bg-surface-raised hover:border-primary-200'
      )}
    >
      <span
        className={cn(
          'mr-2.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 sm:mr-3',
          disabled
            ? 'border-muted bg-muted'
            : checked
              ? 'border-primary-400 bg-primary-400'
              : 'border-primary-200 bg-primary-200'
        )}
      >
        {/* The tick draws itself on rather than popping in. pathLength is a
            Framer convenience for stroke-dasharray, so this needs no
            hardcoded path length. */}
        <motion.svg
          viewBox="0 0 20 20"
          fill="none"
          className="size-3 text-white"
          initial={false}
          animate={checked ? 'checked' : 'unchecked'}
        >
          <motion.path
            d="M4 10.5 L8.5 15 L16 6"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              unchecked: { pathLength: 0, opacity: 0 },
              checked: { pathLength: 1, opacity: 1 },
            }}
            transition={{ duration: m.duration(0.25), ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </span>
      <span
        className={cn(
          'text-sm font-medium sm:text-base',
          disabled ? 'text-muted-foreground' : 'text-foreground'
        )}
      >
        {label}
      </span>
    </motion.button>
  )
}
