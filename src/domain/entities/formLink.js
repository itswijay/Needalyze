import { LINK_STATUS } from '../constants/formStatus'

/**
 * A shareable link an advisor generates for one customer to fill in.
 *
 * @typedef {Object} FormLink
 * @property {string} linkId - internal UUID primary key, never exposed in a URL.
 * @property {string} slug - short public identifier used in the customer-facing URL.
 * @property {string} advisorUserId - the advisor the resulting form belongs to.
 *   This is the authority on ownership; it is never taken from a request body.
 * @property {string} status
 * @property {Date | null} generatedAt
 * @property {Date | null} expiresAt
 */

/**
 * @param {Partial<FormLink>} props
 * @returns {FormLink}
 */
export function createFormLink(props) {
  return {
    linkId: props.linkId,
    slug: props.slug,
    advisorUserId: props.advisorUserId,
    status: props.status || LINK_STATUS.ACTIVE,
    generatedAt: props.generatedAt || null,
    expiresAt: props.expiresAt || null,
  }
}

/**
 * @param {FormLink} link
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isExpired(link, now = new Date()) {
  if (!link?.expiresAt) return false
  return link.expiresAt.getTime() < now.getTime()
}

/**
 * @param {FormLink} link
 * @returns {boolean}
 */
export function isActive(link) {
  return link?.status === LINK_STATUS.ACTIVE
}

/**
 * A link can be read from and written to only while it is both active and
 * unexpired. The read path already checked this; the write path did not, so a
 * customer who kept a tab open could keep submitting past the expiry.
 *
 * @param {FormLink} link
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isUsable(link, now = new Date()) {
  return isActive(link) && !isExpired(link, now)
}
