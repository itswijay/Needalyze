import { attempt } from '@/application/result'
import { USER_STATUS } from '@/domain/constants/userStatus'

/**
 * Soft-delete your own account.
 *
 * The row is marked deleted rather than removed, which is what makes the
 * "recoverable within 7 days" promise in the confirmation dialog possible.
 * Signing the browser out is the caller's job — the session lives there.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function deleteMyAccount({ userProfiles }) {
  return ({ userId }) =>
    attempt(async () => {
      await userProfiles.update(userId, { status: USER_STATUS.DELETED })
      return { deleted: true }
    })
}
