import { createContainer } from '@/infrastructure/container'
import { requireUser } from '@/infrastructure/http/requireUser'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { getAdvisorDashboard } from '@/application/use-cases/need-analysis/getAdvisorDashboard'

export async function GET(request) {
  let caller
  try {
    caller = await requireUser(request)
  } catch (error) {
    return toResponse(Result.fromError(error))
  }

  const { needAnalyses } = createContainer({ accessToken: caller.accessToken })

  return toResponse(
    await getAdvisorDashboard({ needAnalyses })({ advisorUserId: caller.userId })
  )
}
