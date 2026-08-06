import { FORM_STATUS } from '../constants/formStatus'
import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEEDS,
} from '../constants/needCategories'

/**
 * The counts behind the advisor's dashboard tiles.
 *
 * Previously eight `Allforms.filter(...)` expressions inlined in a useEffect on
 * the dashboard page, each repeating the same "completed, and has this key"
 * shape with the category name typed out by hand.
 *
 * @param {import('../entities/needAnalysis').NeedAnalysis[]} analyses
 * @returns {{ completedForms: number, inProgress: number, categories: Record<string, number> }}
 */
export function summarize(analyses = []) {
  const completed = analyses.filter(
    (analysis) => analysis.status === FORM_STATUS.COMPLETED
  )

  const countNeed = (key) =>
    completed.filter((analysis) => analysis.coverage?.insuranceNeeds?.[key])
      .length

  return {
    completedForms: completed.length,
    inProgress: analyses.filter(
      (analysis) => analysis.status === FORM_STATUS.PENDING
    ).length,
    categories: {
      // "Health" is any health cover at all, not one specific cover.
      health: completed.filter((analysis) =>
        HEALTH_COVER_KEYS.some((key) => analysis.coverage?.healthCovers?.[key])
      ).length,
      education: countNeed(INSURANCE_NEEDS.HIGHER_EDUCATION_CHILDREN),
      pensionfund: countNeed(INSURANCE_NEEDS.PENSION_FUND),
      DependentsCostofLiving: countNeed(
        INSURANCE_NEEDS.DEPENDENT_COST_OF_LIVING
      ),
      longTermSavings: countNeed(INSURANCE_NEEDS.LONG_TERM_SAVINGS),
      shortTermSavings: countNeed(INSURANCE_NEEDS.SHORT_TERM_SAVINGS),
    },
  }
}
