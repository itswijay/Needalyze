/**
 * Job positions an advisor can hold. Previously duplicated as inline arrays in
 * register/page.jsx and dashboard/components/Profile.jsx, which had them in
 * different orders.
 */
export const POSITIONS = Object.freeze({
  ADVISOR: 'Advisor',
  TEAM_LEADER: 'Team Leader',
  BRANCH_MANAGER: 'Branch Manager',
})

/** Order used when rendering the position dropdowns. */
export const POSITION_OPTIONS = Object.freeze([
  POSITIONS.BRANCH_MANAGER,
  POSITIONS.ADVISOR,
  POSITIONS.TEAM_LEADER,
])

/** Positions that must supply a registration code number at sign-up. */
export const POSITIONS_REQUIRING_CODE = Object.freeze([
  POSITIONS.ADVISOR,
  POSITIONS.TEAM_LEADER,
])

/**
 * @param {string} position
 * @returns {boolean}
 */
export function requiresCodeNumber(position) {
  return POSITIONS_REQUIRING_CODE.includes(position)
}
