import { describe, expect, it } from 'vitest'

import { step1Schema, step2Schema, step3Schema } from './needAnalysis'
import {
  emptySelection,
  HEALTH_COVERS,
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
} from '@/domain/constants/needCategories'

/** The message of the first issue, or null when the input was accepted. */
const firstError = (schema, input) => {
  const result = schema.safeParse(input)
  return result.success ? null : result.error.issues[0].message
}

const validStep1 = {
  fullName: 'Sunil Karunarathna',
  dateOfBirth: new Date('1985-06-15'),
  spouseName: '',
  address: '12 Temple Road',
  phoneNumber: '+94771234567',
  numberOfChildren: 0,
  childrenAges: '',
  occupation: '',
  monthlyIncome: 70000,
}

describe('step1Schema', () => {
  it('accepts a complete submission', () => {
    expect(step1Schema.safeParse(validStep1).success).toBe(true)
  })

  describe('date of birth', () => {
    // Regression guard. The schema briefly used z.coerce.date(), which runs
    // new Date(null) — the epoch — so a form left on its `null` default passed
    // validation and stored 1970-01-01 with an age of 56.
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['an empty string', ''],
    ])('rejects %s rather than coercing it to the epoch', (_label, value) => {
      const result = step1Schema.safeParse({
        ...validStep1,
        dateOfBirth: value,
      })

      expect(result.success).toBe(false)
      expect(result.error.issues[0].message).toBe('Date of birth is required')
    })

    it('accepts a real Date', () => {
      const result = step1Schema.safeParse({
        ...validStep1,
        dateOfBirth: new Date('1990-01-01'),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('phone number', () => {
    it('requires a country code', () => {
      expect(firstError(step1Schema, { ...validStep1, phoneNumber: '0771234567' })).toBe(
        'Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)'
      )
    })

    it('rejects a blank number', () => {
      expect(firstError(step1Schema, { ...validStep1, phoneNumber: '' })).toBe(
        'Phone number is required'
      )
    })
  })

  describe("children's ages", () => {
    const agesMessage =
      "Enter the exact number of children's ages separated by commas (e.g., 5, 8, 12)"

    it('accepts one age per child', () => {
      const result = step1Schema.safeParse({
        ...validStep1,
        numberOfChildren: 3,
        childrenAges: '5, 8, 12',
      })
      expect(result.success).toBe(true)
    })

    it('rejects a count that does not match the ages given', () => {
      expect(
        firstError(step1Schema, {
          ...validStep1,
          numberOfChildren: 3,
          childrenAges: '5, 8',
        })
      ).toBe(agesMessage)
    })

    it('rejects non-numeric ages', () => {
      expect(
        firstError(step1Schema, {
          ...validStep1,
          numberOfChildren: 2,
          childrenAges: '5, eight',
        })
      ).toBe(agesMessage)
    })

    it('ignores the ages field when there are no children', () => {
      const result = step1Schema.safeParse({
        ...validStep1,
        numberOfChildren: 0,
        childrenAges: '',
      })
      expect(result.success).toBe(true)
    })
  })

  it('requires a monthly income above zero', () => {
    expect(firstError(step1Schema, { ...validStep1, monthlyIncome: 0 })).toBe(
      'Monthly income is required'
    )
  })

  it('requires a full name and an address', () => {
    expect(firstError(step1Schema, { ...validStep1, fullName: '' })).toBe(
      'Full name is required'
    )
    expect(firstError(step1Schema, { ...validStep1, address: '' })).toBe(
      'Address is required'
    )
  })
})

describe('step2Schema', () => {
  const blank = {
    insuranceNeeds: emptySelection(INSURANCE_NEED_KEYS),
    healthCovers: emptySelection(HEALTH_COVER_KEYS),
  }

  it('accepts an empty selection', () => {
    expect(step2Schema.safeParse(blank).success).toBe(true)
  })

  it('allows at most three health covers', () => {
    const result = step2Schema.safeParse({
      ...blank,
      healthCovers: {
        ...blank.healthCovers,
        [HEALTH_COVERS.DAILY_HOSPITALIZATION_EXPENSES]: true,
        [HEALTH_COVERS.SURGERY_COVER]: true,
        [HEALTH_COVERS.CRITICAL_ILLNESS]: true,
      },
    })
    expect(result.success).toBe(true)
  })

  it('rejects a fourth health cover', () => {
    const result = step2Schema.safeParse({
      ...blank,
      healthCovers: Object.fromEntries(HEALTH_COVER_KEYS.map((key) => [key, true])),
    })

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('You can choose only 3 options')
  })

  it('rejects surgery cover and hospital bill cover together', () => {
    const result = step2Schema.safeParse({
      ...blank,
      healthCovers: {
        ...blank.healthCovers,
        [HEALTH_COVERS.SURGERY_COVER]: true,
        [HEALTH_COVERS.HOSPITAL_BILL_COVER]: true,
      },
    })

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe(
      'Cannot select hospital bill cover and surgery cover at same time'
    )
  })

  // The step-2 page reads this path to decide whether to show the toast, so the
  // shape matters as much as the message.
  it('reports refinement failures against the healthCovers field', () => {
    const result = step2Schema.safeParse({
      ...blank,
      healthCovers: Object.fromEntries(HEALTH_COVER_KEYS.map((key) => [key, true])),
    })

    expect(result.error.issues[0].path).toEqual(['healthCovers'])
  })
})

describe('step3Schema', () => {
  const validStep3 = {
    fixedMonthlyExpenses: 50000,
    bankInterestRate: 8,
    unsecuredBankLoan: '',
    cashInHandInsurance: '',
  }

  it('accepts a valid calculation and defaults the optional fields to zero', () => {
    const result = step3Schema.safeParse(validStep3)

    expect(result.success).toBe(true)
    expect(result.data.unsecuredBankLoan).toBe(0)
    expect(result.data.cashInHandInsurance).toBe(0)
  })

  // These messages were silently dropped: zod 4 ignores `required_error`, so
  // the customer saw "Invalid input: expected number, received undefined".
  it.each([
    ['fixedMonthlyExpenses', 'Fixed monthly expenses is required'],
    ['bankInterestRate', 'Bank interest rate is required'],
  ])('names the field when %s is blank', (field, message) => {
    expect(firstError(step3Schema, { ...validStep3, [field]: '' })).toBe(message)
  })

  it.each([
    ['fixedMonthlyExpenses', 'Fixed monthly expenses must be greater than 0'],
    ['bankInterestRate', 'Bank interest rate must be greater than 0'],
  ])('rejects a non-positive %s', (field, message) => {
    expect(firstError(step3Schema, { ...validStep3, [field]: 0 })).toBe(message)
  })

  it('caps the interest rate at 100%', () => {
    expect(firstError(step3Schema, { ...validStep3, bankInterestRate: 150 })).toBe(
      'Bank interest rate cannot exceed 100%'
    )
  })

  it('rejects a negative optional amount', () => {
    expect(firstError(step3Schema, { ...validStep3, unsecuredBankLoan: -1 })).toBe(
      'Cannot be negative'
    )
  })
})
