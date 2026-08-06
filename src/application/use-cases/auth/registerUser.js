import { attempt } from '@/application/result'
import { ConflictError, ValidationError } from '@/domain/errors'
import { createUserProfile } from '@/domain/entities/userProfile'
import { roleIdForPosition } from '@/domain/services/rolePolicy'
import { USER_STATUS } from '@/domain/constants/userStatus'
import { registerSchema } from '@/application/validation/auth'

/**
 * Create an advisor account, pending admin approval.
 *
 * The old client-side version left an orphan `auth.users` row whenever the
 * profile insert failed — a comment there acknowledged it and suggested a
 * trigger. Running server-side means we can hold the service role and actually
 * roll the account back.
 *
 * @param {{ auth: import('@/application/ports/authGateway').AdminAuthGateway, userProfiles: import('@/application/ports/userProfileRepository').UserProfileRepository }} deps
 */
export function registerUser({ auth, userProfiles }) {
  return (input) =>
    attempt(async () => {
      const parsed = registerSchema.safeParse(input)
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues[0]?.message || 'Please check the details you entered'
        )
      }

      const data = parsed.data
      let userId

      try {
        ;({ userId } = await auth.createAccount({
          email: data.email,
          password: data.password,
        }))
      } catch (error) {
        throw asSignUpError(error)
      }

      try {
        await userProfiles.create(
          createUserProfile({
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            branch: data.branch,
            position: data.position,
            codeNumber: data.regCode?.trim() || null,
            roleId: roleIdForPosition(data.position),
            status: USER_STATUS.PENDING,
          })
        )
      } catch (error) {
        // Do not strand an auth user with no profile: it can never sign in, and
        // it blocks the address from being registered again.
        await auth.deleteAccount(userId).catch((cleanupError) => {
          console.error(
            'Failed to roll back auth user after profile insert failed:',
            cleanupError
          )
        })
        throw asProfileError(error)
      }

      return { userId }
    })
}

function asSignUpError(error) {
  const message = error?.message || ''

  if (
    error?.code === 'user_already_exists' ||
    message.includes('already registered')
  ) {
    return new ConflictError(
      'This email address is already registered. Please login or use a different email address.'
    )
  }

  return error
}

function asProfileError(error) {
  const message = error?.message || ''

  if (error?.code === '23503' || message.includes('foreign key constraint')) {
    return new ConflictError(
      'This email address is already registered. Please login or use a different email address.'
    )
  }

  if (error?.code === '23505' || message.includes('duplicate key')) {
    // phone_number and code_number are the two unique columns on the table.
    if (message.includes('code_number')) {
      return new ConflictError(
        'This code number is already registered. Please check and try again.'
      )
    }
    return new ConflictError(
      'This phone number is already registered. Please use a different phone number.'
    )
  }

  return error
}
