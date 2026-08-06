import * as z from 'zod'

import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
  MAX_HEALTH_COVERS,
  findHealthCoverConflict,
} from '@/domain/constants/needCategories'
import {
  optionalAmount,
  phoneNumberSchema,
  requiredAmount,
  requiredDate,
} from './common'

/**
 * Input schemas for the four form steps.
 *
 * Both sides use these: the pages pass them to `zodResolver`, and the save use
 * case re-validates with the same schema before touching the database. A rule
 * relaxed in the UI can no longer quietly become a rule the server does not
 * enforce.
 */

export const step1Schema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    // The calendar caps the year, but nothing stopped a date later than today
    // being posted — the table holds a row with a date of birth in the future
    // and an age of -1. The check runs at parse time so "today" is not frozen
    // at module load. Any minimum-age rule is a policy question and is
    // deliberately not asserted here.
    dateOfBirth: requiredDate('Date of birth is required').refine(
      (date) => date <= new Date(),
      { message: 'Date of birth cannot be in the future' }
    ),
    spouseName: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    phoneNumber: phoneNumberSchema,
    numberOfChildren: z.coerce
      .number()
      .min(0, 'Number of children is required')
      .int('Must be a whole number'),
    childrenAges: z.string().optional(),
    occupation: z.string().optional(),
    monthlyIncome: z.coerce
      .number()
      .min(1, 'Monthly income is required')
      .int('Must be a valid number'),
  })
  .refine(
    (data) => {
      if (data.numberOfChildren <= 0) return true
      const ages = (data.childrenAges || '')
        .split(',')
        .map((age) => age.trim())
        .filter(Boolean)
      return (
        ages.length === data.numberOfChildren &&
        ages.every((age) => /^\d+$/.test(age))
      )
    },
    {
      message:
        "Enter the exact number of children's ages separated by commas (e.g., 5, 8, 12)",
      path: ['childrenAges'],
    }
  )

/** A `{ key: boolean }` map covering exactly the allowed keys. */
const selectionSchema = (keys) =>
  z.object(Object.fromEntries(keys.map((key) => [key, z.boolean()])))

export const step2Schema = z.object({
  insuranceNeeds: selectionSchema(INSURANCE_NEED_KEYS),
  healthCovers: selectionSchema(HEALTH_COVER_KEYS)
    .refine(
      (covers) => Object.values(covers).filter(Boolean).length <= MAX_HEALTH_COVERS,
      { message: `You can choose only ${MAX_HEALTH_COVERS} options` }
    )
    .refine((covers) => findHealthCoverConflict(covers) === null, {
      message:
        'Cannot select hospital bill cover and surgery cover at same time',
    }),
})

export const step3Schema = z.object({
  fixedMonthlyExpenses: requiredAmount('Fixed monthly expenses'),
  bankInterestRate: requiredAmount('Bank interest rate').pipe(
    z.number().max(100, 'Bank interest rate cannot exceed 100%')
  ),
  unsecuredBankLoan: optionalAmount(0),
  cashInHandInsurance: optionalAmount(0),
})

/** The step name → schema lookup the save use case dispatches on. */
export const STEP_SCHEMAS = Object.freeze({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
})
