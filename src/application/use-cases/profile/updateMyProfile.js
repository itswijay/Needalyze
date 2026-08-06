import { attempt } from '@/application/result'
import { ConflictError, ValidationError } from '@/domain/errors'
import { isAdmin, isApproved } from '@/domain/entities/userProfile'
import { profileSchema } from '@/application/validation/auth'

/**
 * Edit your own details.
 *
 * The dialog this replaces wrote straight to the table from the browser with
 * only a "are these fields non-empty" check, so a phone number in any format
 * and a branch or position outside the allowed lists would both persist.
 *
 * Note the caller cannot change their own role or status — those fields are not
 * in profileSchema, and the mapper only writes the keys it is given.
 *
 * @param {{ userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function updateMyProfile({ userProfiles }) {
  return ({ userId, changes }) =>
    attempt(async () => {
      const parsed = profileSchema.safeParse(changes)
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues[0]?.message || 'Please check the details you entered'
        )
      }

      let profile
      try {
        profile = await userProfiles.update(userId, parsed.data)
      } catch (error) {
        if (error?.code === '23505') {
          throw new ConflictError(
            'That phone number is already registered to another account.'
          )
        }
        throw error
      }

      return {
        profile,
        isAdmin: isAdmin(profile),
        isApproved: isApproved(profile),
      }
    })
}
