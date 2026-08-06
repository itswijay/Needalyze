import { ERROR_CODES, isDomainError } from '@/domain/errors'

/**
 * The single return shape for every use case.
 *
 * Before this, `lib/auth.js` returned `{ success, error, user }`, `lib/admin.js`
 * returned `{ success, profiles, error }` or `{ success, stats, error }`, and
 * the API routes threw — so every caller had to know which convention applied.
 *
 * @template T
 * @typedef {{ success: true, data: T } | { success: false, error: { code: string, message: string } }} Result
 */

export const Result = {
  /**
   * @template T
   * @param {T} [data]
   * @returns {Result<T>}
   */
  ok(data = null) {
    return { success: true, data }
  },

  /**
   * @param {string} code - an ERROR_CODES value
   * @param {string} message - safe to show to an end user
   * @returns {Result<never>}
   */
  fail(code, message) {
    return { success: false, error: { code, message } }
  },

  /**
   * Turn a thrown value into a Result. Domain errors keep their message because
   * they were written for a user to read; anything else is unexpected, so it is
   * logged and replaced with a generic message rather than leaking internals
   * (Supabase errors in particular can name columns and constraints).
   *
   * @param {unknown} error
   * @param {string} [fallbackMessage]
   * @returns {Result<never>}
   */
  fromError(error, fallbackMessage = 'Something went wrong. Please try again.') {
    if (isDomainError(error)) {
      return Result.fail(error.code, error.message)
    }
    console.error('Unexpected use-case failure:', error)
    return Result.fail(ERROR_CODES.UNEXPECTED, fallbackMessage)
  },
}

/**
 * Run a use-case body, converting any throw into a failed Result. Keeps use
 * cases free of boilerplate try/catch.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {string} [fallbackMessage]
 * @returns {Promise<Result<T>>}
 */
export async function attempt(fn, fallbackMessage) {
  try {
    return Result.ok(await fn())
  } catch (error) {
    return Result.fromError(error, fallbackMessage)
  }
}
