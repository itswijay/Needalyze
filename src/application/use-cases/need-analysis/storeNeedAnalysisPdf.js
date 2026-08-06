import { attempt } from '@/application/result'
import { ExpiredError, NotFoundError, ValidationError } from '@/domain/errors'
import { isActive, isExpired, isValidLinkId } from '@/domain/entities/formLink'

const MAX_PDF_BYTES = 5 * 1024 * 1024
const FOLDER = 'need-analysis'

/**
 * Store a generated report against its form link.
 *
 * The browser can only rasterise the PDF (html2canvas needs a DOM), so the file
 * arrives here already rendered. What the browser no longer decides is *where*
 * it lands: the storage path is derived from the saved analysis, so a caller
 * cannot choose an arbitrary key in the bucket, overwrite someone else's report
 * or upload against a dead link.
 *
 * @param {{ formLinks: import('@/application/ports/formLinkRepository').FormLinkRepository, needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository, fileStorage: import('@/application/ports/fileStorage').FileStorage, buildFilename: (customerName: string) => string }} deps
 */
export function storeNeedAnalysisPdf({
  formLinks,
  needAnalyses,
  fileStorage,
  buildFilename,
}) {
  return ({ linkId, file }) =>
    attempt(async () => {
      if (!isValidLinkId(linkId)) {
        throw new ValidationError('Invalid link ID format')
      }

      if (!file || typeof file.arrayBuffer !== 'function') {
        throw new ValidationError('No PDF was uploaded')
      }

      if (file.size > MAX_PDF_BYTES) {
        throw new ValidationError('The generated PDF is too large to store')
      }

      if (file.type && file.type !== 'application/pdf') {
        throw new ValidationError('Only PDF uploads are accepted')
      }

      const link = await formLinks.findById(linkId)

      if (!link || !isActive(link)) {
        throw new NotFoundError('Invalid link')
      }

      if (isExpired(link)) {
        throw new ExpiredError('Link has expired')
      }

      const analysis = await needAnalyses.findByLinkId(linkId)
      if (!analysis) {
        throw new NotFoundError('There is no completed form to save')
      }

      const filename = buildFilename(analysis.personal.fullName)

      const stored = await fileStorage.upload({
        // Namespaced by link so one customer's report cannot clobber another's.
        path: `${FOLDER}/${linkId}/${filename}`,
        body: Buffer.from(await file.arrayBuffer()),
        contentType: 'application/pdf',
      })

      return { filename, url: stored.url, path: stored.path }
    })
}
