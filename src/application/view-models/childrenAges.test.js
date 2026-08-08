import { describe, expect, it } from 'vitest'

import {
  clampCount,
  formatChildrenAges,
  MAX_CHILDREN,
  parseChildrenAges,
} from './childrenAges'

describe('formatChildrenAges', () => {
  // This is the boundary where a regression would silently corrupt stored
  // data, so it is asserted directly rather than through the component.
  it('serialises to the comma format the column already holds', () => {
    expect(formatChildrenAges(['5', '8', '12'])).toBe('5, 8, 12')
    expect(formatChildrenAges([5, 8, 12])).toBe('5, 8, 12')
  })

  it('writes an empty string when there are no children', () => {
    expect(formatChildrenAges([])).toBe('')
  })

  it('drops blank slots rather than persisting "5, , 12"', () => {
    expect(formatChildrenAges(['5', '', '12'])).toBe('5, 12')
  })
})

describe('parseChildrenAges', () => {
  it('reads a stored value back into one slot per child', () => {
    expect(parseChildrenAges('5, 8, 12', 3)).toEqual(['5', '8', '12'])
  })

  it('round-trips', () => {
    const stored = '5, 8, 12'
    expect(formatChildrenAges(parseChildrenAges(stored, 3))).toBe(stored)
  })

  it('tolerates spacing the old free-text field allowed', () => {
    expect(parseChildrenAges('5,8 ,  12', 3)).toEqual(['5', '8', '12'])
  })

  // Rows written before the stepper existed can disagree with their own count.
  it('pads when the stored list is shorter than the count', () => {
    expect(parseChildrenAges('5', 3)).toEqual(['5', '', ''])
  })

  it('trims when the stored list is longer than the count', () => {
    expect(parseChildrenAges('5, 8, 12', 2)).toEqual(['5', '8'])
  })

  it('returns nothing for no children', () => {
    expect(parseChildrenAges('', 0)).toEqual([])
    expect(parseChildrenAges(null, 0)).toEqual([])
  })
})

describe('clampCount', () => {
  it('keeps the count inside the supported range', () => {
    expect(clampCount(-3)).toBe(0)
    expect(clampCount(3)).toBe(3)
    expect(clampCount(999)).toBe(MAX_CHILDREN)
  })

  it('coerces the strings the number input produces', () => {
    expect(clampCount('4')).toBe(4)
    expect(clampCount('')).toBe(0)
    expect(clampCount('abc')).toBe(0)
    expect(clampCount(2.7)).toBe(2)
  })
})
