import { describe, expect, it } from 'vitest'

import { calculateAge } from './age'

// `asOf` is injected so these assertions do not rot as the clock moves.
const asOf = new Date('2026-08-06')

describe('calculateAge', () => {
  it('counts completed years once the birthday has passed', () => {
    expect(calculateAge(new Date('1990-01-15'), asOf)).toBe(36)
  })

  it('does not count a birthday still to come this year', () => {
    expect(calculateAge(new Date('1990-12-25'), asOf)).toBe(35)
  })

  it('counts the birthday itself', () => {
    expect(calculateAge(new Date('1990-08-06'), asOf)).toBe(36)
  })

  it('does not count the day before the birthday', () => {
    expect(calculateAge(new Date('1990-08-07'), asOf)).toBe(35)
  })

  it('accepts an ISO string, which is how dates arrive over the wire', () => {
    expect(calculateAge('1990-01-15', asOf)).toBe(36)
  })

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['an empty string', ''],
    ['unparseable text', 'not a date'],
  ])('returns null for %s', (_label, value) => {
    expect(calculateAge(value, asOf)).toBeNull()
  })

  it('returns null rather than a negative age for a future date', () => {
    expect(calculateAge(new Date('2030-01-01'), asOf)).toBeNull()
  })
})
