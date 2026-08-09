import { attempt } from '@/application/result'
import { ValidationError } from '@/domain/errors'
import { DEFAULT_LINK_EXPIRY_HOURS } from '@/domain/constants/formStatus'

const MAX_EXPIRY_HOURS = 24 * 90

/**
 * Generate a form link for the signed-in advisor.
 *
 * The owner is the authenticated caller — never a value from the request body.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, baseUrl: string }} deps
 */
export function createFormLink({ formLinks, baseUrl }) {
  return ({ advisorUserId, expiryHours = DEFAULT_LINK_EXPIRY_HOURS }) =>
    attempt(async () => {
      const hours = Number(expiryHours)

      if (!Number.isFinite(hours) || hours <= 0 || hours > MAX_EXPIRY_HOURS) {
        throw new ValidationError(
          `Link expiry must be between 1 and ${MAX_EXPIRY_HOURS} hours`
        )
      }

      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000)
      const link = await formLinks.create({ advisorUserId, expiresAt })

      return {
        linkId: link.linkId,
        expiresAt: link.expiresAt,
        formUrl: `${baseUrl}/form/${link.slug}`,
      }
    })
}
