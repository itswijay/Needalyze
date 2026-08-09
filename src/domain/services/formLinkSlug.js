import { customAlphabet } from 'nanoid'

const SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SLUG_LENGTH = 10
const SLUG_PATTERN = new RegExp(`^[a-z0-9]{${SLUG_LENGTH}}$`)

const nanoid = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH)

/**
 * The public identifier used in a customer-facing form link, in place of the
 * link's internal UUID. Lowercase letters and digits only, so a link never
 * looks like two words run together or depends on case being preserved.
 *
 * @returns {string}
 */
export function generateSlug() {
  return nanoid()
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidSlug(value) {
  return typeof value === 'string' && SLUG_PATTERN.test(value)
}
