import { attempt } from '@/application/result'
import { ExpiredError, NotFoundError, ValidationError } from '@/domain/errors'
import { isActive, isExpired } from '@/domain/entities/formLink'
import { isValidSlug } from '@/domain/services/formLinkSlug'

/**
 * Fetch the analysis behind a customer's form link.
 *
 * Anonymous: possession of an unexpired, active link is the authorisation.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository }} deps
 * @param {{ slug: string }} input
 */
export function loadNeedAnalysis({ formLinks, needAnalyses }) {
  return ({ slug }) =>
    attempt(async () => {
      if (!isValidSlug(slug)) {
        throw new ValidationError('Invalid link ID format')
      }

      const link = await formLinks.findBySlug(slug)

      if (!link || !isActive(link)) {
        throw new NotFoundError('Invalid or expired link')
      }

      if (isExpired(link)) {
        throw new ExpiredError('Link has expired')
      }

      return {
        link: { linkId: link.linkId, expiresAt: link.expiresAt },
        analysis: await needAnalyses.findByLinkId(link.linkId),
      }
    })
}
