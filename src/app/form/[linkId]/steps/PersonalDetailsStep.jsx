'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Controller } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'

import { step1Schema } from '@/application/validation/needAnalysis'
import FormContainer from '@/components/FormContainer'
import FormField from '@/components/FormField'
import FormNavButton from '@/components/FormNavButton'
import { Calendar } from '@/components/ui/calendar'
import { ChildrenField } from '@/components/ui/children-field'
import { Input } from '@/components/ui/input'
import { PhoneField } from '@/components/ui/phone-field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { toastValidationErrors, useStepForm } from './stepForm'

const DEFAULT_VALUES = {
  fullName: '',
  dateOfBirth: null,
  spouseName: '',
  phoneNumber: '',
  address: '',
  numberOfChildren: '',
  childrenAges: '',
  occupation: '',
  monthlyIncome: '',
}

const calendarProps = {
  mode: 'single',
  fromYear: 1950,
  toYear: new Date().getFullYear(),
  captionLayout: 'dropdown',
  initialFocus: true,
}

const hydrate = (data) => ({
  ...data,
  dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
})

export default function PersonalDetailsStep({ onSubmit, isSubmitting }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useStepForm({
    step: 'step1',
    schema: step1Schema,
    defaultValues: DEFAULT_VALUES,
    hydrate,
  })

  useEffect(() => setMounted(true), [])

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

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setOpen(false)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (open) window.addEventListener('keydown', onKeyDown)
    else window.removeEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, mounted, onKeyDown])

  const submit = handleSubmit(onSubmit, toastValidationErrors)

  return (
    <FormContainer title="Your details">
      <form
        id="step1-form"
        className="grid grid-cols-1 gap-4 text-sm sm:gap-5 md:grid-cols-2"
        onSubmit={submit}
      >
        <FormField
          label="Full Name"
          placeholder="Ex: Sunil Nishantha Karunarathna"
          error={errors.fullName?.message}
          {...register('fullName')}
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
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
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
                    <div className="relative z-50 rounded-2xl border border-border bg-surface-raised p-3 shadow-xl">
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

        {/* Full width: an address needs the room, and with seven
            single-width fields around one full-width Children control
            the grid would otherwise be left with a hole in it. */}
        <FormField
          label="Address"
          placeholder="Your Address"
          error={errors.address?.message}
          className="md:col-span-2"
          {...register('address')}
        />

        <FormField label="Phone Number" error={errors.phoneNumber?.message}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <PhoneField
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.phoneNumber)}
              />
            )}
          />
        </FormField>

        <FormField
          label="Spouse's Name"
          placeholder="Ex: Samanthi Ishara Karunarathna"
          error={errors.spouseName?.message}
          {...register('spouseName')}
        />

        {/* One control drives both stored fields, so the count and the
            age list cannot disagree the way two free-text boxes could. */}
        <FormField
          label="Children"
          error={
            errors.numberOfChildren?.message ?? errors.childrenAges?.message
          }
          className="md:col-span-2"
        >
          <Controller
            control={control}
            name="numberOfChildren"
            render={({ field: countField }) => (
              <Controller
                control={control}
                name="childrenAges"
                render={({ field: agesField }) => (
                  <ChildrenField
                    count={countField.value}
                    ages={agesField.value}
                    invalid={Boolean(
                      errors.numberOfChildren || errors.childrenAges
                    )}
                    onChange={({ count, ages }) => {
                      countField.onChange(count)
                      agesField.onChange(ages)
                    }}
                  />
                )}
              />
            )}
          />
        </FormField>

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
          {...register('monthlyIncome')}
        />
      </form>

      <div className="mt-8 flex items-center justify-end">
        <FormNavButton
          label={isSubmitting ? 'Saving…' : 'Next'}
          type="next"
          onClick={submit}
          disabled={isSubmitting}
        />
      </div>
    </FormContainer>
  )
}
