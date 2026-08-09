import { attempt } from '@/application/result'
import { ExpiredError, NotFoundError, ValidationError } from '@/domain/errors'
import { isActive, isExpired } from '@/domain/entities/formLink'
import { isValidSlug } from '@/domain/services/formLinkSlug'
import { FORM_STATUS } from '@/domain/constants/formStatus'
import { calculateAge } from '@/domain/services/age'
import { calculateLifeCover } from '@/domain/services/humanLifeValue'
import { STEP_SCHEMAS } from '@/application/validation/needAnalysis'

/**
 * Persist one step of a customer's need analysis.
 *
 * Two things changed from the route this replaces:
 *
 * 1. The advisor a form belongs to now comes from the link record. The old
 *    route read `user_id` from the request body while running on the
 *    service-role key, so any caller could attribute a form to any advisor.
 * 2. The stored life-cover figure is computed here from the submitted inputs
 *    rather than taken from a client-supplied `actualHLValue`.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository }} deps
 */
export function saveNeedAnalysisStep({ formLinks, needAnalyses }) {
  return ({ slug, step, data }) =>
    attempt(async () => {
      if (!isValidSlug(slug)) {
        throw new ValidationError('Invalid link ID format')
      }

      const schema = STEP_SCHEMAS[step]
      if (!schema) {
        throw new ValidationError(`Unknown form step: ${step}`)
      }

      const link = await formLinks.findBySlug(slug)

      if (!link || !isActive(link)) {
        throw new NotFoundError('Invalid link')
      }

      // The write path has to enforce expiry too, not just the read path.
      if (isExpired(link)) {
        throw new ExpiredError('Link has expired')
      }

      const parsed = schema.safeParse(data)
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues[0]?.message ||
            'Please check the details you entered'
        )
      }

      const patch = patchForStep(step, parsed.data)
      const existing = await needAnalyses.findByLinkId(link.linkId)

      if (existing) {
        return {
          analysis: await needAnalyses.updateByLinkId(link.linkId, patch),
        }
      }

      if (step !== 'step1') {
        throw new ValidationError('Form must be started from step 1')
      }

      return {
        analysis: await needAnalyses.create({
          linkId: link.linkId,
          advisorUserId: link.advisorUserId,
          patch,
        }),
      }
    })
}

/**
 * Describe the change in domain terms. Column names are the mapper's business.
 *
 * @param {string} step
 * @param {Object} input - already validated
 * @returns {Partial<import('@/domain/entities/needAnalysis').NeedAnalysis>}
 */
function patchForStep(step, input) {
  if (step === 'step1') {
    return {
      personal: { ...input, age: calculateAge(input.dateOfBirth) },
    }
  }

  if (step === 'step2') {
    return {
      coverage: {
        insuranceNeeds: input.insuranceNeeds,
        healthCovers: input.healthCovers,
      },
    }
  }

  // step3: submitting the calculation is what completes the form. The inputs
  // are stored with the result so the report survives a reload.
  const { actualHlv } = calculateLifeCover(input)
  return {
    lifeCover: { ...input, humanLifeValue: actualHlv },
    status: FORM_STATUS.COMPLETED,
  }
}
