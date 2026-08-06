import { ROLE_IDS } from '../constants/roles'
import { POSITIONS } from '../constants/positions'

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
  if (
    position === POSITIONS.TEAM_LEADER ||
    position === POSITIONS.BRANCH_MANAGER
  ) {
    return ROLE_IDS.ADMIN
  }
  // Advisor, and anything unrecognised, defaults to the least-privileged role.
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
