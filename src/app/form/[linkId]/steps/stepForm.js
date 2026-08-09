'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { useFormContext } from '@/context/FormContext'

/**
 * A step's form, seeded once from the loaded draft.
 *
 * Seeding keys off `isLoaded` rather than the step's data, which `getStepData`
 * returns as a fresh object identity on every provider render — depending on
 * that would reset the fields under the customer while they type. Each step is
 * mounted only while it is the current one, so returning to a step re-seeds it
 * naturally, which is also what makes "Fill Again" clear the fields.
 *
 * @param {{ step: string, schema: import('zod').ZodTypeAny, defaultValues: Object, hydrate?: (data: Object) => Object }} config
 */
export function useStepForm({ step, schema, defaultValues, hydrate }) {
  const { getStepData, isLoaded } = useFormContext()
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  })

  const { reset } = form
  const seeded = useRef(false)

  useEffect(() => {
    if (!isLoaded || seeded.current) return
    seeded.current = true

    const data = getStepData(step)
    if (data) reset(hydrate ? hydrate(data) : data)
  }, [isLoaded, step, getStepData, hydrate, reset])

  return form
}

/**
 * Surface validation failures the customer cannot otherwise see.
 *
 * Takes the errors react-hook-form passes in, rather than reading `errors` from
 * the render closure — on a first failed submit that closure still holds the
 * previous render's empty object, so no toast fired.
 *
 * @param {Record<string, { message?: string }>} validationErrors
 */
export function toastValidationErrors(validationErrors) {
  Object.values(validationErrors).forEach((error) => {
    if (error?.message) toast.error(error.message)
  })
}
