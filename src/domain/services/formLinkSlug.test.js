import { describe, expect, it } from 'vitest'

import { generateSlug, isValidSlug } from './formLinkSlug'

describe('generateSlug', () => {
  it('produces a slug generateSlug itself accepts', () => {
    expect(isValidSlug(generateSlug())).toBe(true)
  })
})

describe('isValidSlug', () => {
  it('accepts a lowercase-alphanumeric 10-character slug', () => {
    expect(isValidSlug('ab3xq9k2lm')).toBe(true)
  })

  it('rejects the old UUID shape', () => {
    expect(isValidSlug('945187dd-8932-4c92-9918-bb06dda81247')).toBe(false)
  })

  it.each([
    ['too short', 'abc123'],
    ['too long', 'ab3xq9k2lmzzzz'],
    ['contains a capital letter', 'ab3xq9k2Lm'],
    ['contains a dash', 'ab3xq9-2lm'],
    ['contains a space', 'ab3xq9k2 m'],
    ['not a string', 12345],
    ['null', null],
    ['undefined', undefined],
  ])('rejects %s', (_label, value) => {
    expect(isValidSlug(value)).toBe(false)
  })
})
