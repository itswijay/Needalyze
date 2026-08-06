import { ERROR_CODES } from '@/domain/errors'

/**
 * Maps the domain's error vocabulary onto HTTP. This is the only place that
 * knows both.
 */
const STATUS_BY_CODE = {
  [ERROR_CODES.VALIDATION]: 400,
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.EXPIRED]: 410,
  [ERROR_CODES.UNEXPECTED]: 500,
}

/**
 * @param {string} code
 * @returns {number}
 */
export function statusForCode(code) {
  return STATUS_BY_CODE[code] ?? 500
}

/**
 * Serialise a use-case Result as the JSON response.
 *
 * The wire format keeps the `{ success, error }` shape the existing clients
 * already read, and adds `code` so callers can branch on the reason without
 * string-matching the message. Successful payload fields are spread at the top
 * level, matching the current routes (`{ success: true, linkData, formData }`).
 *
 * @param {{ success: boolean, data?: any, error?: { code: string, message: string } }} result
 * @param {number} [okStatus]
 */
export function toResponse(result, okStatus = 200) {
  if (result.success) {
    const payload =
      result.data && typeof result.data === 'object' && !Array.isArray(result.data)
        ? result.data
        : { data: result.data }
    return Response.json({ success: true, ...payload }, { status: okStatus })
  }

  return Response.json(
    { success: false, code: result.error.code, error: result.error.message },
    { status: statusForCode(result.error.code) }
  )
}
