import { createContainer } from '@/infrastructure/container'
import { requireUser } from '@/infrastructure/http/requireUser'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { ERROR_CODES } from '@/domain/errors'
import { getMyProfile } from '@/application/use-cases/profile/getMyProfile'
import { updateMyProfile } from '@/application/use-cases/profile/updateMyProfile'
import { deleteMyAccount } from '@/application/use-cases/profile/deleteMyAccount'

/**
 * The signed-in advisor's own profile. Every handler acts as the caller, so row
 * level security applies on top of the checks in the use cases.
 */

async function withCaller(request, handler) {
  let caller
  try {
    caller = await requireUser(request)
  } catch (error) {
    return toResponse(Result.fromError(error))
  }

  const { userProfiles } = createContainer({ accessToken: caller.accessToken })
  return toResponse(await handler({ caller, userProfiles }))
}

export async function GET(request) {
  return withCaller(request, ({ caller, userProfiles }) =>
    getMyProfile({ userProfiles })({ userId: caller.userId })
  )
}

export async function PATCH(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return toResponse(
      Result.fail(ERROR_CODES.VALIDATION, 'Invalid request body')
    )
  }

  return withCaller(request, ({ caller, userProfiles }) =>
    updateMyProfile({ userProfiles })({ userId: caller.userId, changes: body })
  )
}

export async function DELETE(request) {
  return withCaller(request, ({ caller, userProfiles }) =>
    deleteMyAccount({ userProfiles })({ userId: caller.userId })
  )
}
