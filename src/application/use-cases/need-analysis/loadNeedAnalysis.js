import { attempt } from '@/application/result'
import { ExpiredError, NotFoundError, ValidationError } from '@/domain/errors'
import { isActive, isExpired, isValidLinkId } from '@/domain/entities/formLink'

/**
 * Fetch the analysis behind a customer's form link.
 *
 * Anonymous: possession of an unexpired, active link is the authorisation.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository }} deps
 * @param {{ linkId: string }} input
 */
export function loadNeedAnalysis({ formLinks, needAnalyses }) {
  return ({ linkId }) =>
    attempt(async () => {
      if (!isValidLinkId(linkId)) {
        throw new ValidationError('Invalid link ID format')
      }

      const link = await formLinks.findById(linkId)

      if (!link || !isActive(link)) {
        throw new NotFoundError('Invalid or expired link')
      }

      if (isExpired(link)) {
        throw new ExpiredError('Link has expired')
      }

      return {
        link: { linkId: link.linkId, expiresAt: link.expiresAt },
        analysis: await needAnalyses.findByLinkId(linkId),
      }
    })
}
