import { describe, expect, it } from 'vitest'

import { loginSchema, profileSchema, registerSchema } from './auth'
import { POSITIONS } from '@/domain/constants/positions'
import { BRANCH_OPTIONS } from '@/domain/constants/branches'

const firstError = (schema, input) => {
  const result = schema.safeParse(input)
  return result.success ? null : result.error.issues[0].message
}

const validRegistration = {
  firstName: 'Pubudu',
  lastName: 'Wijesundara',
  phoneNumber: '+94771234567',
  branch: BRANCH_OPTIONS[0],
  position: POSITIONS.BRANCH_MANAGER,
  regCode: '',
  email: 'advisor@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
}

describe('registerSchema', () => {
  it('accepts a branch manager without a code number', () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    expect(
      firstError(registerSchema, {
        ...validRegistration,
        confirmPassword: 'different',
      })
    ).toBe('Passwords do not match')
  })

  it('rejects a short password', () => {
    expect(
      firstError(registerSchema, {
        ...validRegistration,
        password: 'abc',
        confirmPassword: 'abc',
      })
    ).toBe('Password must be at least 6 characters')
  })

  it.each([
    [POSITIONS.ADVISOR],
    [POSITIONS.TEAM_LEADER],
  ])('requires a code number for %s', (position) => {
    expect(
      firstError(registerSchema, { ...validRegistration, position, regCode: '' })
    ).toBe('Code number is required for this position')

    expect(
      registerSchema.safeParse({
        ...validRegistration,
        position,
        regCode: 'A123',
      }).success
    ).toBe(true)
  })

  it('does not accept whitespace as a code number', () => {
    expect(
      firstError(registerSchema, {
        ...validRegistration,
        position: POSITIONS.ADVISOR,
        regCode: '   ',
      })
    ).toBe('Code number is required for this position')
  })

  // The lists are closed sets, so a value typed past the dropdown is rejected
  // rather than stored.
  it('rejects a branch outside the allowed list', () => {
    expect(
      firstError(registerSchema, { ...validRegistration, branch: 'Nowhere' })
    ).toBe('Please select a branch')
  })

  it('rejects a position outside the allowed list', () => {
    expect(
      firstError(registerSchema, {
        ...validRegistration,
        position: 'Regional Director',
      })
    ).toBe('Please select a position')
  })

  it('rejects names containing digits', () => {
    expect(
      firstError(registerSchema, { ...validRegistration, firstName: 'Pubudu3' })
    ).toBe('First name should contain only letters')
  })

  it('rejects a malformed phone number', () => {
    expect(
      firstError(registerSchema, { ...validRegistration, phoneNumber: '0771234567' })
    ).toBe(
      'Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)'
    )
  })

  it('rejects a malformed email', () => {
    expect(
      firstError(registerSchema, { ...validRegistration, email: 'not-an-email' })
    ).toBe('Please enter a valid email address')
  })
})

describe('profileSchema', () => {
  const { regCode, email, password, confirmPassword, ...profileFields } =
    validRegistration

  it('accepts the profile fields on their own', () => {
    expect(profileSchema.safeParse(profileFields).success).toBe(true)
  })

  // The use case relies on this: a caller must not be able to promote
  // themselves by posting extra fields.
  it('strips role and status if they are supplied', () => {
    const result = profileSchema.safeParse({
      ...profileFields,
      roleId: 'some-admin-uuid',
      status: 'approved',
    })

    expect(result.success).toBe(true)
    expect(result.data).not.toHaveProperty('roleId')
    expect(result.data).not.toHaveProperty('status')
  })

  it('applies the same phone rule as registration', () => {
    expect(
      firstError(profileSchema, { ...profileFields, phoneNumber: '123' })
    ).toBe(
      'Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)'
    )
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: 'secret123' }).success
    ).toBe(true)
  })

  it('requires an email', () => {
    expect(firstError(loginSchema, { email: '', password: 'secret123' })).toBe(
      'Email is required'
    )
  })

  it('requires a password', () => {
    expect(firstError(loginSchema, { email: 'a@b.com', password: '' })).toBe(
      'Password is required'
    )
  })
})
