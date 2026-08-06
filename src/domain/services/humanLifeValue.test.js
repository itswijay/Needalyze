import { describe, expect, it } from 'vitest'

import {
  calculateActualHlv,
  calculateHlv,
  calculateLifeCover,
} from './humanLifeValue'

describe('calculateHlv', () => {
  it('capitalises the annual outgoings at the given rate', () => {
    // (50,000 x 12) / 0.08
    expect(calculateHlv({ fixedMonthlyExpenses: 50000, bankInterestRate: 8 })).toBe(
      7500000
    )
  })

  it('rounds to the nearest rupee', () => {
    expect(calculateHlv({ fixedMonthlyExpenses: 1000, bankInterestRate: 7 })).toBe(
      171429
    )
  })

  it('reads numeric strings, which is what the form inputs produce', () => {
    expect(calculateHlv({ fixedMonthlyExpenses: '50000', bankInterestRate: '8' })).toBe(
      7500000
    )
  })

  it.each([
    ['no inputs at all', {}],
    ['a missing rate', { fixedMonthlyExpenses: 50000 }],
    ['a zero rate', { fixedMonthlyExpenses: 50000, bankInterestRate: 0 }],
    ['zero expenses', { fixedMonthlyExpenses: 0, bankInterestRate: 8 }],
    ['blank strings', { fixedMonthlyExpenses: '', bankInterestRate: '' }],
    ['unparseable text', { fixedMonthlyExpenses: 'abc', bankInterestRate: 'xyz' }],
    ['a negative rate', { fixedMonthlyExpenses: 50000, bankInterestRate: -8 }],
  ])('returns 0 for %s', (_label, input) => {
    expect(calculateHlv(input)).toBe(0)
  })
})

describe('calculateActualHlv', () => {
  it('adds unsecured debt and subtracts existing cover', () => {
    expect(
      calculateActualHlv({
        hlv: 7500000,
        unsecuredBankLoan: 500000,
        cashInHandInsurance: 1000000,
      })
    ).toBe(7000000)
  })

  it('treats missing optional amounts as zero', () => {
    expect(calculateActualHlv({ hlv: 7500000 })).toBe(7500000)
  })

  // A customer whose assets exceed the need requires no cover, not a negative
  // amount of it.
  it('never returns a negative figure', () => {
    expect(
      calculateActualHlv({ hlv: 100000, cashInHandInsurance: 500000 })
    ).toBe(0)
  })
})

describe('calculateLifeCover', () => {
  it('derives both figures from the raw step-3 inputs', () => {
    expect(
      calculateLifeCover({
        fixedMonthlyExpenses: 50000,
        bankInterestRate: 8,
        unsecuredBankLoan: 500000,
        cashInHandInsurance: 1000000,
      })
    ).toEqual({ hlv: 7500000, actualHlv: 7000000 })
  })

  // This is what the server stores, so it must not depend on anything the
  // browser computed.
  it('returns zeroes when the required inputs are absent', () => {
    expect(calculateLifeCover({})).toEqual({ hlv: 0, actualHlv: 0 })
  })
})
