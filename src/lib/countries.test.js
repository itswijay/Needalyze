import { describe, expect, it } from 'vitest'
import { getCountries } from 'libphonenumber-js'

import { countryList, findCountry, toFlag, DEFAULT_COUNTRY } from './countries'

describe('countryList', () => {
  // The list is derived rather than stored, so the thing worth guarding is
  // that no derivation step silently drops out and leaves a row rendering as
  // "undefined" in the picker.
  it('gives every dialable country a name, a dial code and a flag', () => {
    const list = countryList()

    expect(list).toHaveLength(getCountries().length)
    for (const country of list) {
      expect(country.name, `${country.iso} name`).toBeTruthy()
      expect(country.dialCode, `${country.iso} dial code`).toMatch(/^\+\d+$/)
      expect(country.flag, `${country.iso} flag`).toBeTruthy()
    }
  })

  it('sorts by name so the picker is scannable', () => {
    const names = countryList().map((c) => c.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('is memoised', () => {
    expect(countryList()).toBe(countryList())
  })
})

describe('findCountry', () => {
  it('resolves the default country the phone field opens on', () => {
    expect(findCountry(DEFAULT_COUNTRY)).toMatchObject({
      iso: 'LK',
      name: 'Sri Lanka',
      dialCode: '+94',
    })
  })

  it('returns null rather than throwing for an unknown code', () => {
    expect(findCountry('ZZ')).toBeNull()
  })
})

describe('toFlag', () => {
  it('maps an ISO code onto its regional indicator pair', () => {
    expect(toFlag('LK')).toBe('🇱🇰')
    expect(toFlag('GB')).toBe('🇬🇧')
  })

  it('accepts lowercase', () => {
    expect(toFlag('lk')).toBe(toFlag('LK'))
  })
})
