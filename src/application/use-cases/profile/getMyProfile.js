import { attempt } from '@/application/result'
import { NotFoundError } from '@/domain/errors'
import { isAdmin, isApproved, isApprover } from '@/domain/entities/userProfile'

/**
 * The signed-in advisor's own profile, plus the derived flags the UI gates
 * on. Those were computed in AuthContext by comparing `role_id` against a
 * constant and `status` against a string literal — decisions the domain owns.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function getMyProfile({ userProfiles }) {
  return ({ userId }) =>
    attempt(async () => {
      const profile = await userProfiles.findByUserId(userId)

      if (!profile) {
        throw new NotFoundError('Profile not found')
      }

      return {
        profile,
        isAdmin: isAdmin(profile),
        isApproved: isApproved(profile),
        isApprover: isApprover(profile),
      }
    })
}
