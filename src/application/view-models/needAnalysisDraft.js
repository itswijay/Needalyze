import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
  emptySelection,
  selectionFromKeys,
} from '@/domain/constants/needCategories'
import { FORM_STATUS } from '@/domain/constants/formStatus'

/**
 * The step-keyed shape the four form pages edit.
 *
 * A view model, not an entity: it exists because the UI is a wizard, and it
 * holds the four step-3 inputs that the form needs but the database has no
 * columns for. Entities arrive here as JSON, so dates are ISO strings.
 */

export function emptyDraft() {
  return {
    step1: {
      fullName: '',
      dateOfBirth: null,
      spouseName: '',
      address: '',
      phoneNumber: '',
      numberOfChildren: '',
      childrenAges: '',
      occupation: '',
      monthlyIncome: '',
    },
    step2: {
      insuranceNeeds: emptySelection(INSURANCE_NEED_KEYS),
      healthCovers: emptySelection(HEALTH_COVER_KEYS),
    },
    step3: {
      fixedMonthlyExpenses: '',
      bankInterestRate: '',
      unsecuredBankLoan: '',
      cashInHandInsurance: '',
      humanLifeValue: 0,
    },
    step4: {
      completed: false,
    },
  }
}

/**
 * @param {Object | null} analysis - a serialised NeedAnalysis, or null for a
 *   link that has not been started yet
 * @returns {ReturnType<typeof emptyDraft>}
 */
export function toDraft(analysis) {
  const draft = emptyDraft()
  if (!analysis) return draft

  const { personal = {}, coverage = {}, lifeCover = {} } = analysis

  return {
    step1: {
      fullName: personal.fullName || '',
      dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth) : null,
      spouseName: personal.spouseName || '',
      address: personal.address || '',
      phoneNumber: personal.phoneNumber || '',
      numberOfChildren: personal.numberOfChildren ?? '',
      childrenAges: personal.childrenAges || '',
      occupation: personal.occupation || '',
      monthlyIncome: personal.monthlyIncome ?? '',
    },
    step2: {
      // Sent over the wire as `{ key: boolean }` already, but rebuilt from the
      // canonical key list so an unknown or missing key can't slip through.
      insuranceNeeds: selectionFromKeys(
        selectedFrom(coverage.insuranceNeeds),
        INSURANCE_NEED_KEYS
      ),
      healthCovers: selectionFromKeys(
        selectedFrom(coverage.healthCovers),
        HEALTH_COVER_KEYS
      ),
    },
    step3: {
      // The four inputs below are deliberately blank on reload: the
      // need_analysis_form table stores only the resulting total, so there is
      // nothing to restore them from.
      ...draft.step3,
      humanLifeValue: lifeCover.humanLifeValue ?? 0,
    },
    step4: {
      completed: analysis.status === FORM_STATUS.COMPLETED,
    },
  }
}

/**
 * @param {Record<string, boolean> | string[] | null | undefined} selection
 * @returns {string[]}
 */
function selectedFrom(selection) {
  if (!selection) return []
  if (Array.isArray(selection)) return selection
  return Object.entries(selection)
    .filter(([, isSelected]) => Boolean(isSelected))
    .map(([key]) => key)
}
