import { attempt } from '@/application/result'
import { USER_STATUS } from '@/domain/constants/userStatus'
import { fullName } from '@/domain/entities/userProfile'

/**
 * The accounts waiting for an approval decision.
 *
 * The query this replaces asked for a `user_profile.email` column that does not
 * exist, which PostgREST rejects outright — so the pending-approvals dialog was
 * failing for every admin who opened it.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function listPendingUsers({ userProfiles }) {
  return ({ actorBranch } = {}) =>
    attempt(async () => {
      const profiles = await userProfiles.listByStatus(
        USER_STATUS.PENDING,
        actorBranch ? { branch: actorBranch } : {}
      )

      return {
        users: profiles.map((profile) => ({
          userId: profile.userId,
          name: fullName(profile) || 'Unknown',
          branch: profile.branch || 'Not Provided',
          codeNumber: profile.codeNumber || 'Not Provided',
          position: profile.position || '',
        })),
      }
    })
}
