import * as z from 'zod'

/**
 * Field-level schemas shared by every form.
 *
 * The phone rule in particular was written out twice with the same regex and
 * the same message — once in the step-1 customer form, once in the advisor
 * registration form — so the two could drift apart silently.
 */

export const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^\+\d{11}$/,
    'Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)'
  )

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters')

/**
 * A money or count field the customer may leave blank. Blank becomes the given
 * fallback rather than NaN.
 *
 * @param {number} fallback
 */
export const optionalAmount = (fallback = 0) =>
  z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return fallback
    const number = Number(value)
    return Number.isNaN(number) ? fallback : number
  }, z.number({ invalid_type_error: 'Please enter a valid number' }).nonnegative('Cannot be negative'))

/**
 * A required numeric field, with messages phrased for the specific field.
 *
 * @param {string} label
 */
export const requiredAmount = (label) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined
      const number = Number(value)
      return Number.isNaN(number) ? undefined : number
    },
    z
      .number({
        required_error: `${label} is required`,
        invalid_type_error: `${label} is required`,
      })
      .positive(`${label} must be greater than 0`)
  )
