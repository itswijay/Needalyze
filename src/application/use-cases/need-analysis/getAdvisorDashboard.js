import { attempt } from '@/application/result'
import { summarize } from '@/domain/services/needAnalysisStats'
import { toRow } from '@/application/view-models/needAnalysisRow'

/**
 * Everything the advisor's dashboard renders: their forms as table rows, and
 * the tile counts.
 *
 * The page used to query the table from the browser and aggregate in a
 * useEffect. Doing it here means the tiles and the table are computed from one
 * read, and the advisor's id comes from the authenticated session rather than
 * from whatever the client's profile state happened to hold.
 *
 * @param {{ needAnalyses: import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository }} deps
 */
export function getAdvisorDashboard({ needAnalyses }) {
  return ({ advisorUserId }) =>
    attempt(async () => {
      const analyses = await needAnalyses.listByAdvisor(advisorUserId)

      return {
        forms: analyses.map(toRow),
        cardData: summarize(analyses),
      }
    })
}
