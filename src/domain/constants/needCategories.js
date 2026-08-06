/**
 * The insurance needs and health covers a customer can select in step 2.
 *
 * These keys are the contract between the form UI, the `insurance_needs` /
 * `health_covers` text[] columns, the PDF template and the dashboard tiles.
 * They were previously re-typed by hand in six places (FormContext initial
 * state, the form API route's step-2 branch, the step-2 zod schema, the PDF
 * template, the dashboard aggregation and Dashtable), so a typo in any one of
 * them silently produced a category that never matched.
 */

export const INSURANCE_NEEDS = Object.freeze({
  DEPENDENT_COST_OF_LIVING: 'dependentCostOfLiving',
  HIGHER_EDUCATION_CHILDREN: 'higherEducationChildren',
  LONG_TERM_SAVINGS: 'longTermSavings',
  SHORT_TERM_SAVINGS: 'shortTermSavings',
  PENSION_FUND: 'pensionFund',
})

export const HEALTH_COVERS = Object.freeze({
  DAILY_HOSPITALIZATION_EXPENSES: 'dailyHospitalizationExpenses',
  SURGERY_COVER: 'surgeryCover',
  HOSPITAL_BILL_COVER: 'hospitalBillCover',
  CRITICAL_ILLNESS: 'criticalIllness',
})

export const INSURANCE_NEED_KEYS = Object.freeze(Object.values(INSURANCE_NEEDS))
export const HEALTH_COVER_KEYS = Object.freeze(Object.values(HEALTH_COVERS))

/** Human-readable labels, keyed by the same identifiers. */
export const INSURANCE_NEED_LABELS = Object.freeze({
  [INSURANCE_NEEDS.DEPENDENT_COST_OF_LIVING]: 'Dependents Cost of Living',
  [INSURANCE_NEEDS.HIGHER_EDUCATION_CHILDREN]: 'Higher Education of Children',
  [INSURANCE_NEEDS.LONG_TERM_SAVINGS]: 'Long Term Savings',
  [INSURANCE_NEEDS.SHORT_TERM_SAVINGS]: 'Short Term Savings',
  [INSURANCE_NEEDS.PENSION_FUND]: 'Pension Fund',
})

export const HEALTH_COVER_LABELS = Object.freeze({
  [HEALTH_COVERS.DAILY_HOSPITALIZATION_EXPENSES]:
    'Daily Hospitalization Expenses',
  [HEALTH_COVERS.SURGERY_COVER]: 'Surgery Cover',
  [HEALTH_COVERS.HOSPITAL_BILL_COVER]: 'Hospital Bill Cover',
  [HEALTH_COVERS.CRITICAL_ILLNESS]: 'Critical Illness',
})

/** A customer may pick at most this many health covers. */
export const MAX_HEALTH_COVERS = 3

/**
 * Health covers that cannot be held at the same time. Each entry is a pair of
 * mutually exclusive keys.
 */
export const CONFLICTING_HEALTH_COVERS = Object.freeze([
  Object.freeze([HEALTH_COVERS.HOSPITAL_BILL_COVER, HEALTH_COVERS.SURGERY_COVER]),
])

/**
 * Build a selection map with every key set to false — the shape step 2 stores
 * in the draft and posts to the API.
 *
 * @param {readonly string[]} keys
 * @returns {Record<string, boolean>}
 */
export function emptySelection(keys) {
  return Object.fromEntries(keys.map((key) => [key, false]))
}

/**
 * Collapse a `{ key: boolean }` selection map into the array of selected keys
 * that the database columns hold.
 *
 * @param {Record<string, boolean>} selection
 * @param {readonly string[]} allowedKeys
 * @returns {string[]}
 */
export function selectedKeys(selection, allowedKeys) {
  if (!selection) return []
  return allowedKeys.filter((key) => Boolean(selection[key]))
}

/**
 * Expand a stored array of keys back into a `{ key: boolean }` selection map.
 *
 * @param {string[] | null | undefined} keys
 * @param {readonly string[]} allowedKeys
 * @returns {Record<string, boolean>}
 */
export function selectionFromKeys(keys, allowedKeys) {
  const selected = new Set(keys || [])
  return Object.fromEntries(
    allowedKeys.map((key) => [key, selected.has(key)])
  )
}

/**
 * Which of the two mutually exclusive covers, if any, the given selection
 * already holds — used to explain the conflict to the customer.
 *
 * @param {Record<string, boolean>} selection
 * @returns {[string, string] | null}
 */
export function findHealthCoverConflict(selection) {
  const conflict = CONFLICTING_HEALTH_COVERS.find(
    ([a, b]) => selection?.[a] && selection?.[b]
  )
  return conflict ? [...conflict] : null
}
