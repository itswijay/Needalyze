/**
 * Domain error vocabulary.
 *
 * Use cases fail with one of these codes; the HTTP layer is what decides which
 * status code each one maps to (see infrastructure/http/response.js). Nothing in
 * here knows about HTTP, Supabase, or React.
 */

export const ERROR_CODES = Object.freeze({
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  EXPIRED: 'EXPIRED',
  CONFLICT: 'CONFLICT',
  UNEXPECTED: 'UNEXPECTED',
})

export class DomainError extends Error {
  /**
   * @param {string} code - one of ERROR_CODES
   * @param {string} message - safe to show to an end user
   * @param {Object} [details] - extra context for logging, never user-facing
   */
  constructor(code, message, details = undefined) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.details = details
  }
}

export class ValidationError extends DomainError {
  constructor(message, details) {
    super(ERROR_CODES.VALIDATION, message, details)
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Not found', details) {
    super(ERROR_CODES.NOT_FOUND, message, details)
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Authentication required', details) {
    super(ERROR_CODES.UNAUTHORIZED, message, details)
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'You do not have permission to do that', details) {
    super(ERROR_CODES.FORBIDDEN, message, details)
  }
}

export class ExpiredError extends DomainError {
  constructor(message = 'This has expired', details) {
    super(ERROR_CODES.EXPIRED, message, details)
  }
}

export class ConflictError extends DomainError {
  constructor(message, details) {
    super(ERROR_CODES.CONFLICT, message, details)
  }
}

/**
 * True when the value is one of our own errors, i.e. its message was written for
 * a user to read. Anything else is an unexpected failure whose message must not
 * be leaked.
 *
 * @param {unknown} error
 * @returns {error is DomainError}
 */
export function isDomainError(error) {
  return error instanceof DomainError
}
