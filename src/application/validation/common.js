import * as z from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

/**
 * Field-level schemas shared by every form.
 *
 * The phone rule in particular was written out twice with the same regex and
 * the same message — once in the step-1 customer form, once in the advisor
 * registration form — so the two could drift apart silently.
 *
 * That rule used to be /^\+\d{11}$/ — exactly eleven digits, which is Sri
 * Lanka's shape hardcoded. It rejected valid Indian, British, Emirati and
 * Singaporean numbers, so the country picker in the UI would have offered
 * countries this refused. isValidPhoneNumber reads the country from the `+`
 * prefix and checks against that country's real numbering plan, which also
 * gives one canonical form per number — the `phone_number` column on
 * user_profiles is UNIQUE, so two spellings of one number used to register as
 * two advisors.
 */

export const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(isValidPhoneNumber, 'Enter a valid phone number for the selected country')

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters')

/**
 * Custom messages on a type constructor go in `error`.
 *
 * zod 4 replaced `required_error` and `invalid_type_error` with this single
 * option, and — because unknown keys in the params object are ignored rather
 * than rejected — schemas still passing the old names silently fall back to
 * "Invalid input: expected number, received undefined". Messages attached to
 * refinements (`.min()`, `.positive()`, `.email()`, …) are unaffected.
 */

/**
 * A required date, accepting either a Date or a parseable string.
 *
 * Both shapes have to work: the browser validates a real Date straight from the
 * calendar component, while the server validates the same payload after it has
 * been through JSON, where that Date is an ISO string.
 *
 * Deliberately not `z.coerce.date()`, which runs `new Date(value)` on anything
 * — including `null`, which becomes the epoch and passes. A form left on its
 * `null` default would validate and store 1970-01-01.
 *
 * @param {string} message
 */
export const requiredDate = (message) =>
  z.preprocess((value) => {
    if (value === null || value === undefined || value === '') return undefined
    if (value instanceof Date) return value

    // Strings are only ever produced by JSON-serialising a Date, so they must
    // look like ISO 8601. Anything else is rejected rather than handed to
    // `new Date()`, whose fallback parser is lenient enough to turn prose like
    // "sometime in 1990" into a real date.
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return undefined
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  }, z.date({ error: message }))

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
  }, z.number({ error: 'Please enter a valid number' }).nonnegative('Cannot be negative'))

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
      .number({ error: `${label} is required` })
      .positive(`${label} must be greater than 0`)
  )
