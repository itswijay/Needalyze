import { createContainer } from '@/infrastructure/container'
import { toResponse } from '@/infrastructure/http/response'
import { Result } from '@/application/result'
import { ERROR_CODES } from '@/domain/errors'
import { needAnalysisFilename } from '@/infrastructure/pdf/needAnalysisTemplate'
import { storeNeedAnalysisPdf } from '@/application/use-cases/need-analysis/storeNeedAnalysisPdf'

/**
 * Save the report the browser just rendered.
 *
 * Anonymous like the other customer-facing form endpoints — the link is the
 * authorisation — but the file's destination is decided here, not by the caller.
 */
export async function POST(request, { params }) {
  const { linkId } = await params

  let form
  try {
    form = await request.formData()
  } catch {
    return toResponse(
      Result.fail(ERROR_CODES.VALIDATION, 'Expected a multipart upload')
    )
  }

  const container = createContainer({ serviceRole: true })

  const result = await storeNeedAnalysisPdf({
    ...container,
    buildFilename: needAnalysisFilename,
  })({ slug: linkId, file: form.get('file') })

  return toResponse(result)
}
