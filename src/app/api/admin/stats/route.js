import { createContainer } from '@/infrastructure/container'
import { requireAdmin } from '@/infrastructure/http/requireUser'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { getUserStatistics } from '@/application/use-cases/admin/getUserStatistics'

export async function GET(request) {
  let caller
  try {
    caller = await requireAdmin(request)
  } catch (error) {
    return toResponse(Result.fromError(error))
  }

  const { userProfiles } = createContainer({ accessToken: caller.accessToken })
  return toResponse(await getUserStatistics({ userProfiles })())
}
