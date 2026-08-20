import { describe, expect, it } from 'vitest'

import {
  isAdminRole,
  isBranchManager,
  canManageUser,
  roleIdForPosition,
} from './rolePolicy'
import { ROLE_IDS } from '../constants/roles'
import { POSITIONS } from '../constants/positions'
import { USER_STATUS } from '../constants/userStatus'

describe('roleIdForPosition', () => {
  it('gives team leader the admin role', () => {
    expect(roleIdForPosition(POSITIONS.TEAM_LEADER)).toBe(ROLE_IDS.ADMIN)
  })

  it.each([
    [POSITIONS.BRANCH_MANAGER],
    [POSITIONS.ADVISOR],
  ])('gives %s the ordinary user role', (position) => {
    expect(roleIdForPosition(position)).toBe(ROLE_IDS.USER)
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

describe('isBranchManager', () => {
  it('returns true for approved branch managers', () => {
    expect(
      isBranchManager({
        position: POSITIONS.BRANCH_MANAGER,
        status: USER_STATUS.APPROVED,
      })
    ).toBe(true)
  })

  it('returns false for unapproved branch managers or other positions', () => {
    expect(
      isBranchManager({
        position: POSITIONS.BRANCH_MANAGER,
        status: USER_STATUS.PENDING,
      })
    ).toBe(false)
    expect(
      isBranchManager({
        position: POSITIONS.ADVISOR,
        status: USER_STATUS.APPROVED,
      })
    ).toBe(false)
  })
})

describe('canManageUser', () => {
  const sysAdmin = {
    role_id: ROLE_IDS.ADMIN,
    status: USER_STATUS.APPROVED,
    position: POSITIONS.TEAM_LEADER,
    branch: 'Colombo',
  }

  const adminAndBranchMgr = {
    role_id: ROLE_IDS.ADMIN,
    status: USER_STATUS.APPROVED,
    position: POSITIONS.BRANCH_MANAGER,
    branch: 'Warakapola',
  }

  const branchMgrWarakapola = {
    role_id: ROLE_IDS.USER,
    status: USER_STATUS.APPROVED,
    position: POSITIONS.BRANCH_MANAGER,
    branch: 'Warakapola',
  }

  it('allows System Admin to manage any user regardless of position', () => {
    expect(canManageUser(sysAdmin, { branch: 'Kandy' })).toBe(true)
    expect(canManageUser(adminAndBranchMgr, { branch: 'Kandy' })).toBe(true)
  })

  it('allows Branch Manager (non-admin) to manage users in their own branch only', () => {
    expect(canManageUser(branchMgrWarakapola, { branch: 'Warakapola' })).toBe(true)
    expect(canManageUser(branchMgrWarakapola, { branch: 'Kandy' })).toBe(false)
  })

  it('denies unapproved actors from managing users', () => {
    const unapprovedMgr = { ...branchMgrWarakapola, status: USER_STATUS.PENDING }
    expect(canManageUser(unapprovedMgr, { branch: 'Warakapola' })).toBe(false)
  })
})
