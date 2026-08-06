import { createContainer } from '@/infrastructure/container'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { ERROR_CODES } from '@/domain/errors'
import { loadNeedAnalysis } from '@/application/use-cases/need-analysis/loadNeedAnalysis'
import { saveNeedAnalysisStep } from '@/application/use-cases/need-analysis/saveNeedAnalysisStep'

/**
 * The customer-facing form endpoint.
 *
 * Anonymous by design: whoever holds an unexpired, active link may read and
 * write the analysis behind it, which is why these run on the service-role key.
 * The authorisation decision therefore lives in the use case, and every field
 * that determines ownership is taken from the link record rather than from the
 * request.
 */

function container() {
  return createContainer({ serviceRole: true })
}

export async function GET(_request, { params }) {
  const { linkId } = await params
  const result = await loadNeedAnalysis(container())({ linkId })
  return toResponse(result)
}

export async function POST(request, { params }) {
  const { linkId } = await params

  let body
  try {
    body = await request.json()
  } catch {
    return toResponse(
      Result.fail(ERROR_CODES.VALIDATION, 'Invalid request body')
    )
  }

  const result = await saveNeedAnalysisStep(container())({
    linkId,
    step: body?.step,
    data: body?.data,
  })

  return toResponse(result)
}
