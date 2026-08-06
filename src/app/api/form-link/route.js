import { baseUrl, createContainer } from '@/infrastructure/container'
import { requireUser } from '@/infrastructure/http/requireUser'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { createFormLink } from '@/application/use-cases/form-link/createFormLink'

export async function POST(request) {
  let caller
  try {
    caller = await requireUser(request)
  } catch (error) {
    return toResponse(Result.fromError(error))
  }

  const body = await request.json().catch(() => ({}))
  const { formLinks } = createContainer({ accessToken: caller.accessToken })

  const result = await createFormLink({ formLinks, baseUrl: baseUrl() })({
    advisorUserId: caller.userId,
    expiryHours: body?.expiry_hours,
  })

  return toResponse(result)
}
