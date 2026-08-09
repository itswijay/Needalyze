import { createContainer } from '@/infrastructure/container'
import { toResponse } from '@/infrastructure/http/response'
import { resetNeedAnalysis } from '@/application/use-cases/need-analysis/resetNeedAnalysis'

/**
 * "Fill Again" — anonymous, authorised by possession of the link, like the rest
 * of the customer-facing form endpoints.
 */
export async function POST(_request, { params }) {
  const { linkId } = await params
  const container = createContainer({ serviceRole: true })
  const result = await resetNeedAnalysis(container)({ slug: linkId })
  return toResponse(result)
}
