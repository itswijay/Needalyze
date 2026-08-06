import * as z from 'zod'

import { BRANCH_OPTIONS } from '@/domain/constants/branches'
import {
  POSITION_OPTIONS,
  requiresCodeNumber,
} from '@/domain/constants/positions'
import { emailSchema, passwordSchema, phoneNumberSchema } from './common'

const nameSchema = (label) =>
  z
    .string()
    .min(1, `${label} is required`)
    .regex(/^[a-zA-Z\s]+$/, `${label} should contain only letters`)

/** The fields shared by registration and profile editing. */
const profileFields = {
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  phoneNumber: phoneNumberSchema,
  branch: z.enum(BRANCH_OPTIONS, { message: 'Please select a branch' }),
  position: z.enum(POSITION_OPTIONS, { message: 'Please select a position' }),
}

export const registerSchema = z
  .object({
    ...profileFields,
    regCode: z.string().optional(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      !requiresCodeNumber(data.position) || Boolean(data.regCode?.trim()),
    {
      message: 'Code number is required for this position',
      path: ['regCode'],
    }
  )

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({ email: emailSchema })

/** Editing your own profile: the same fields, minus credentials. */
export const profileSchema = z.object(profileFields)
