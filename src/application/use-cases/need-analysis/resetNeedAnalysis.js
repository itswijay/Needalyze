import { attempt } from '@/application/result'
import { ExpiredError, NotFoundError, ValidationError } from '@/domain/errors'
import { isActive, isExpired, isValidLinkId } from '@/domain/entities/formLink'
import { FORM_STATUS } from '@/domain/constants/formStatus'

/**
 * Put a finished analysis back to the start so the customer can fill it again.
 *
 * The "Fill Again" button used to do this by posting blank values for steps 1-3
 * one at a time, which wrote a half-empty row and depended on the server
 * accepting an empty name and a null income. Resetting is a single intent, so
 * it gets a single operation — and the values stay put until step 1 is
 * submitted again, rather than being blanked in between.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository }} deps
 */
export function resetNeedAnalysis({ formLinks, needAnalyses }) {
  return ({ linkId }) =>
    attempt(async () => {
      if (!isValidLinkId(linkId)) {
        throw new ValidationError('Invalid link ID format')
      }

      const link = await formLinks.findById(linkId)

      if (!link || !isActive(link)) {
        throw new NotFoundError('Invalid link')
      }

      if (isExpired(link)) {
        throw new ExpiredError('Link has expired')
      }

      const existing = await needAnalyses.findByLinkId(linkId)

      // Nothing started yet — already in the state the caller is asking for.
      if (!existing) return { analysis: null }

      return {
        analysis: await needAnalyses.updateByLinkId(linkId, {
          lifeCover: { humanLifeValue: 0 },
          status: FORM_STATUS.PENDING,
        }),
      }
    })
}
