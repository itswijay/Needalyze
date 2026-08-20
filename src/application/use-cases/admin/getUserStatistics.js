import { attempt } from '@/application/result'
import { USER_STATUS } from '@/domain/constants/userStatus'

/**
 * Account counts for the admin header.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function getUserStatistics({ userProfiles }) {
  return ({ actorBranch } = {}) =>
    attempt(async () => {
      const counts = await userProfiles.countByStatus(
        actorBranch ? { branch: actorBranch } : {}
      )

      return {
        stats: {
          total: counts.total,
          pending: counts[USER_STATUS.PENDING],
          approved: counts[USER_STATUS.APPROVED],
          rejected: counts[USER_STATUS.REJECTED],
        },
      }
    })
}
