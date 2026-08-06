import {
  HEALTH_COVER_LABELS,
  INSURANCE_NEED_LABELS,
} from '@/domain/constants/needCategories'

/**
 * One row of the advisor's dashboard table.
 *
 * Dashtable used to build this itself from raw `need_analysis_form` columns,
 * which made it the third place that knew the database's field names.
 *
 * @param {import('@/domain/entities/needAnalysis').NeedAnalysis} analysis
 */
export function toRow(analysis) {
  return {
    id: analysis.formId,
    user: analysis.personal.fullName || 'Unknown',
    need: describeNeeds(analysis) || 'Not specified',
    actualHumanLifeValue: analysis.lifeCover.humanLifeValue || 0,
    address: analysis.personal.address || 'Not provided',
    date: analysis.createdAt ? analysis.createdAt.toISOString() : null,
    status: analysis.status || 'Unknown',
  }
}

/**
 * The selected needs and covers as one readable list. The old version joined
 * the raw keys, so the table showed "higherEducationChildren, surgeryCover".
 */
function describeNeeds(analysis) {
  const labels = [
    ...labelsFor(analysis.coverage?.insuranceNeeds, INSURANCE_NEED_LABELS),
    ...labelsFor(analysis.coverage?.healthCovers, HEALTH_COVER_LABELS),
  ]
  return labels.join(', ')
}

function labelsFor(selection, labels) {
  if (!selection) return []
  return Object.entries(selection)
    .filter(([, isSelected]) => isSelected)
    .map(([key]) => labels[key] || key)
}
