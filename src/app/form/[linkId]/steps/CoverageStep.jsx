'use client'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Controller } from 'react-hook-form'

import FormContainer from '@/components/FormContainer'
import FormNavButton from '@/components/FormNavButton'
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

import { toastValidationErrors, useStepForm } from './stepForm'

const DEFAULT_VALUES = {
  insuranceNeeds: emptySelection(INSURANCE_NEED_KEYS),
  healthCovers: emptySelection(HEALTH_COVER_KEYS),
}

const INSURANCE_NEEDS = [
  ['dependentCostOfLiving', 'Dependent Cost of Living'],
  ['higherEducationChildren', 'Higher Education of Children'],
  ['longTermSavings', 'Long Term Savings'],
  ['shortTermSavings', 'Short Term Savings'],
  ['pensionFund', 'Pension Fund'],
]

const HEALTH_COVERS = [
  ['dailyHospitalizationExpenses', 'Daily Hospitalization Expenses'],
  ['surgeryCover', 'Surgery Cover'],
  ['hospitalBillCover', 'Hospital Bill Cover'],
  ['criticalIllness', 'Critical Illness'],
]

export default function CoverageStep({ onSubmit, onBack, isSubmitting }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useStepForm({
    step: 'step2',
    schema: step2Schema,
    defaultValues: DEFAULT_VALUES,
  })

  const watchedValues = watch()

  const handleInsuranceNeedChange = (field, currentValue) => {
    setValue(`insuranceNeeds.${field}`, !currentValue, { shouldValidate: true })
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

    handleSubmit(onSubmit, toastValidationErrors)()
  }

  return (
    <FormContainer>
      <div>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:gap-6">
          <CoveragePanel
            title="Insurance Need"
            info={
              <AlertDialogDescription className="text-sm leading-relaxed">
                Select one or more options from the available choices to proceed
                with your insurance needs assessment.
              </AlertDialogDescription>
            }
            infoTitle="Insurance Need Information"
            options={INSURANCE_NEEDS}
            group="insuranceNeeds"
            control={control}
            onToggle={handleInsuranceNeedChange}
          />

          <CoveragePanel
            title="Health Covers"
            info={
              <AlertDialogDescription className="space-y-2 text-sm leading-relaxed">
                <span className="block">
                  You can choose a maximum of 3 options from the available health
                  cover choices.
                </span>
                <span className="block font-medium text-destructive">
                  Note: Cannot select both Hospital Bill Cover and Surgery Cover
                  at the same time.
                </span>
              </AlertDialogDescription>
            }
            infoTitle="Health Covers Information"
            options={HEALTH_COVERS}
            group="healthCovers"
            control={control}
            onToggle={handleHealthCoverChange}
          />
        </div>

        <div className="mt-8 flex w-full flex-row items-center justify-between">
          <FormNavButton label="Back" type="prev" onClick={onBack} />
          <FormNavButton
            label={isSubmitting ? 'Saving…' : 'Next'}
            type="next"
            onClick={handleNext}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </FormContainer>
  )
}

/**
 * One of the two selection panels.
 *
 * The two were written out longhand and were identical but for their heading,
 * their dialog copy and which nine checkboxes they held.
 */
function CoveragePanel({
  title,
  info,
  infoTitle,
  options,
  group,
  control,
  onToggle,
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* Stays a circle while other icon controls moved to the control
                tier: the round form is part of how an "i" marker reads, and at
                24px a rounded square would just look like a small button. */}
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
                {infoTitle}
              </AlertDialogTitle>
              {info}
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
        {options.map(([key, label]) => (
          <Controller
            key={key}
            name={`${group}.${key}`}
            control={control}
            render={({ field }) => (
              <CheckboxCard
                label={label}
                checked={field.value}
                onChange={() => onToggle(key, field.value)}
              />
            )}
          />
        ))}
      </div>
    </div>
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
