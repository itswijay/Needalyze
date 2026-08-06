import { USER_STATUS } from '../constants/userStatus'
import { isAdminRole } from '../services/rolePolicy'

/**
 * An advisor's profile — the `user_profile` row that hangs off an auth user.
 *
 * @typedef {Object} UserProfile
 * @property {string} userId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phoneNumber
 * @property {string} branch
 * @property {string} position
 * @property {string | null} codeNumber
 * @property {string} roleId
 * @property {string} status
 * @property {Date | null} createdAt
 */

/**
 * @param {Partial<UserProfile>} props
 * @returns {UserProfile}
 */
export function createUserProfile(props = {}) {
  return {
    userId: props.userId,
    firstName: props.firstName || '',
    lastName: props.lastName || '',
    phoneNumber: props.phoneNumber || '',
    branch: props.branch || '',
    position: props.position || '',
    codeNumber: props.codeNumber ?? null,
    roleId: props.roleId,
    status: props.status || USER_STATUS.PENDING,
    createdAt: props.createdAt || null,
  }
}

/**
 * @param {UserProfile} profile
 * @returns {boolean}
 */
export function isApproved(profile) {
  return profile?.status === USER_STATUS.APPROVED
}

/**
 * @param {UserProfile} profile
 * @returns {boolean}
 */
export function isAdmin(profile) {
  return isAdminRole(profile?.roleId)
}

/**
 * @param {UserProfile} profile
 * @returns {string}
 */
export function fullName(profile) {
  return `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()
}

/**
 * @param {UserProfile} profile
 * @returns {string} the avatar fallback, e.g. "PW"
 */
export function initials(profile) {
  const first = profile?.firstName?.[0] || ''
  const last = profile?.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase() || 'U'
}

/**
 * Whether this account may use the app, and why not if it may not.
 *
 * Collects the three checks the old signIn() ran inline between Supabase calls,
 * so the reason a login is refused is stated in one place instead of being
 * implied by the order of early returns.
 *
 * @param {{ profile: UserProfile | null, emailConfirmed: boolean }} input
 * @returns {{ allowed: boolean, reason: string | null }}
 */
export function checkSignInEligibility({ profile, emailConfirmed }) {
  if (!emailConfirmed) {
    return {
      allowed: false,
      reason:
        'Please verify your email address before logging in. Check your inbox for the confirmation link.',
    }
  }

  if (!profile) {
    return {
      allowed: false,
      reason: 'Unable to verify account status. Please contact support.',
    }
  }

  if (profile.status === USER_STATUS.REJECTED) {
    return {
      allowed: false,
      reason:
        'Your account request was not approved. Please contact your team leader.',
    }
  }

  if (profile.status === USER_STATUS.DELETED) {
    return {
      allowed: false,
      reason: 'This account has been deleted.',
    }
  }

  if (!isApproved(profile)) {
    return {
      allowed: false,
      reason:
        'Your account is pending approval. Please wait for admin approval.',
    }
  }

  return { allowed: true, reason: null }
}
