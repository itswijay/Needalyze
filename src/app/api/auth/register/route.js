import { createContainer } from '@/infrastructure/container'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { ERROR_CODES } from '@/domain/errors'
import { registerUser } from '@/application/use-cases/auth/registerUser'

/**
 * Sign-up. Anonymous by definition, and the one place allowed to insert a
 * profile row for a user who does not exist yet — hence the service role.
 */
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return toResponse(
      Result.fail(ERROR_CODES.VALIDATION, 'Invalid request body')
    )
  }

  const { auth, userProfiles } = createContainer({ serviceRole: true })
  const result = await registerUser({ auth, userProfiles })(body)

  return toResponse(result, 201)
}
