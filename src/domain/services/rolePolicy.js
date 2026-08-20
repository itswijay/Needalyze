import { ROLE_IDS } from '../constants/roles'
import { POSITIONS } from '../constants/positions'
import { USER_STATUS } from '../constants/userStatus'

/**
 * Which role a newly registered user gets, based on the position they picked.
 * Advisors are ordinary users; team leaders and branch managers administer.
 *
 * Previously `getRoleIdByPosition` inside lib/auth.js.
 *
 * @param {string} position
 * @returns {string} role UUID
 */
export function roleIdForPosition(position) {
  if (position === POSITIONS.TEAM_LEADER) {
    return ROLE_IDS.ADMIN
  }
  // Advisor, Branch Manager, and anything unrecognised, defaults to the user role.
  return ROLE_IDS.USER
}

/**
 * Previously re-implemented as an inline `role_id === ROLE_IDS.ADMIN` comparison
 * in AuthContext and lib/admin.js.
 *
 * @param {string | null | undefined} roleId
 * @returns {boolean}
 */
export function isAdminRole(roleId) {
  return roleId === ROLE_IDS.ADMIN
}

/**
 * @param {{ position?: string, status?: string } | null | undefined} profile
 * @returns {boolean}
 */
export function isBranchManager(profile) {
  return (
    profile?.position === POSITIONS.BRANCH_MANAGER &&
    profile?.status === USER_STATUS.APPROVED
  )
}

/**
 * Check whether an actor profile is permitted to approve or manage a target user.
 *
 * @param {{ role_id?: string, status?: string, position?: string, branch?: string } | null | undefined} actorProfile
 * @param {{ branch?: string } | null | undefined} targetProfile
 * @returns {boolean}
 */
export function canManageUser(actorProfile, targetProfile) {
  if (!actorProfile || actorProfile.status !== USER_STATUS.APPROVED) {
    return false
  }
  if (!targetProfile) {
    return false
  }

  // System Admin (top level) can manage all users regardless of position
  if (isAdminRole(actorProfile.role_id)) {
    return true
  }

  // Branch Manager (non-admin) can manage users in their own branch
  if (isBranchManager(actorProfile)) {
    return Boolean(actorProfile.branch && actorProfile.branch === targetProfile.branch)
  }

  return false
}
