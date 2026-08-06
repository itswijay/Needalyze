import { describe, expect, it } from 'vitest'

import {
  checkSignInEligibility,
  createUserProfile,
  fullName,
  initials,
  isAdmin,
  isApproved,
} from './userProfile'
import { ROLE_IDS } from '../constants/roles'
import { USER_STATUS } from '../constants/userStatus'

const profile = (overrides = {}) =>
  createUserProfile({
    userId: 'u1',
    firstName: 'Pubudu',
    lastName: 'Wijesundara',
    roleId: ROLE_IDS.USER,
    status: USER_STATUS.APPROVED,
    ...overrides,
  })

describe('createUserProfile', () => {
  it('defaults a new profile to pending', () => {
    expect(createUserProfile({ userId: 'u1' }).status).toBe(USER_STATUS.PENDING)
  })

  it('defaults an absent code number to null rather than an empty string', () => {
    expect(createUserProfile({ userId: 'u1' }).codeNumber).toBeNull()
  })
})

describe('fullName and initials', () => {
  it('joins the two names', () => {
    expect(fullName(profile())).toBe('Pubudu Wijesundara')
  })

  it('trims when one name is missing', () => {
    expect(fullName(profile({ lastName: '' }))).toBe('Pubudu')
  })

  it('builds the avatar fallback', () => {
    expect(initials(profile())).toBe('PW')
  })

  it.each([
    ['no profile', undefined],
    ['a nameless profile', profile({ firstName: '', lastName: '' })],
  ])('falls back to U for %s', (_label, value) => {
    expect(initials(value)).toBe('U')
  })
})

describe('isApproved and isAdmin', () => {
  it('recognises an approved account', () => {
    expect(isApproved(profile())).toBe(true)
    expect(isApproved(profile({ status: USER_STATUS.PENDING }))).toBe(false)
  })

  it('recognises an admin', () => {
    expect(isAdmin(profile({ roleId: ROLE_IDS.ADMIN }))).toBe(true)
    expect(isAdmin(profile())).toBe(false)
  })
})

describe('checkSignInEligibility', () => {
  it('lets an approved account with a confirmed email in', () => {
    expect(
      checkSignInEligibility({ profile: profile(), emailConfirmed: true })
    ).toEqual({ allowed: true, reason: null })
  })

  // Checked before the profile, because an unconfirmed address is the more
  // actionable thing to tell someone.
  it('asks for email confirmation first', () => {
    const result = checkSignInEligibility({
      profile: profile({ status: USER_STATUS.PENDING }),
      emailConfirmed: false,
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toMatch(/verify your email/i)
  })

  it.each([
    [USER_STATUS.PENDING, /pending approval/i],
    [USER_STATUS.REJECTED, /not approved/i],
    [USER_STATUS.DELETED, /deleted/i],
  ])('refuses a %s account with its own reason', (status, expected) => {
    const result = checkSignInEligibility({
      profile: profile({ status }),
      emailConfirmed: true,
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toMatch(expected)
  })

  it('refuses when the profile could not be loaded', () => {
    const result = checkSignInEligibility({ profile: null, emailConfirmed: true })

    expect(result.allowed).toBe(false)
    expect(result.reason).toMatch(/contact support/i)
  })
})
