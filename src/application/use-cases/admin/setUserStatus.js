import { attempt } from '@/application/result'
import { NotFoundError, ValidationError } from '@/domain/errors'
import {
  ADMIN_SETTABLE_STATUSES,
  USER_STATUS,
} from '@/domain/constants/userStatus'

/**
 * Approve or reject a pending account.
 *
 * The caller is confirmed to be an approved admin by requireAdmin before this
 * runs — previously the only check was that the browser had rendered the button,
 * since the client called the RPC directly.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function setUserStatus({ userProfiles }) {
  return ({ actorUserId, userId, status }) =>
    attempt(async () => {
      if (!ADMIN_SETTABLE_STATUSES.includes(status)) {
        throw new ValidationError(
          `Invalid status. Must be one of: ${ADMIN_SETTABLE_STATUSES.join(', ')}`
        )
      }

      if (userId === actorUserId) {
        throw new ValidationError('You cannot change your own account status')
      }

      const target = await userProfiles.findByUserId(userId)
      if (!target) {
        throw new NotFoundError('User not found')
      }

      if (target.status === USER_STATUS.DELETED) {
        throw new ValidationError('This account has been deleted')
      }

      await userProfiles.setStatus(userId, status)

      return { userId, status }
    })
}
