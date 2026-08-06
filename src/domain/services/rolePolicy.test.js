import { describe, expect, it } from 'vitest'

import { isAdminRole, roleIdForPosition } from './rolePolicy'
import { ROLE_IDS } from '../constants/roles'
import { POSITIONS } from '../constants/positions'

describe('roleIdForPosition', () => {
  it.each([
    [POSITIONS.TEAM_LEADER],
    [POSITIONS.BRANCH_MANAGER],
  ])('gives %s the admin role', (position) => {
    expect(roleIdForPosition(position)).toBe(ROLE_IDS.ADMIN)
  })

  it('gives an advisor the ordinary user role', () => {
    expect(roleIdForPosition(POSITIONS.ADVISOR)).toBe(ROLE_IDS.USER)
  })

  // Failing closed matters here: an unrecognised position must not be a route
  // to administrator access.
  it.each([
    ['an unknown position', 'Regional Director'],
    ['an empty string', ''],
    ['undefined', undefined],
    ['null', null],
  ])('defaults %s to the least-privileged role', (_label, position) => {
    expect(roleIdForPosition(position)).toBe(ROLE_IDS.USER)
  })
})

describe('isAdminRole', () => {
  it('recognises the admin role id', () => {
    expect(isAdminRole(ROLE_IDS.ADMIN)).toBe(true)
  })

  it.each([
    ['the user role', ROLE_IDS.USER],
    ['an unrelated uuid', '00000000-0000-0000-0000-000000000000'],
    ['undefined', undefined],
    ['null', null],
  ])('rejects %s', (_label, roleId) => {
    expect(isAdminRole(roleId)).toBe(false)
  })
})
