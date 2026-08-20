import { createContainer } from '@/infrastructure/container'
import { requireApprover } from '@/infrastructure/http/requireUser'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { ERROR_CODES } from '@/domain/errors'
import { setUserStatus } from '@/application/use-cases/admin/setUserStatus'

export async function POST(request, { params }) {
  let caller
  try {
    caller = await requireApprover(request)
  } catch (error) {
    return toResponse(Result.fromError(error))
  }

  const { userId } = await params

  let body
  try {
    body = await request.json()
  } catch {
    return toResponse(
      Result.fail(ERROR_CODES.VALIDATION, 'Invalid request body')
    )
  }

  const { userProfiles } = createContainer({ serviceRole: true })

  return toResponse(
    await setUserStatus({ userProfiles })({
      actorUserId: caller.userId,
      actorBranch: caller.branch,
      isSysAdmin: caller.isSysAdmin,
      userId,
      status: body?.status,
    })
  )
}
