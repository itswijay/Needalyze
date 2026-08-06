import { ERROR_CODES } from '@/domain/errors'
import { getAccessToken } from '../supabase/browserClient'

/**
 * The browser's way of reaching the application layer.
 *
 * Presentation code calls these instead of importing Supabase: the token is
 * attached here, and the `{ success, error }` envelope is unwrapped here, so
 * components only ever see plain data or a thrown ApiError.
 */

export class ApiError extends Error {
  /**
   * @param {string} message - safe to show to an end user
   * @param {number} status - HTTP status
   * @param {string} code - an ERROR_CODES value
   */
  constructor(message, status, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: any, auth?: boolean, signal?: AbortSignal }} options
 * @returns {Promise<any>} the response payload, minus the `success` flag
 * @throws {ApiError}
 */
async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = await getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
      ERROR_CODES.UNEXPECTED
    )
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // Non-JSON body (a proxy error page, say) — handled by the !ok branch below.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.error || 'Something went wrong. Please try again.',
      response.status,
      payload?.code || ERROR_CODES.UNEXPECTED
    )
  }

  const { success: _success, ...data } = payload
  return data
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
