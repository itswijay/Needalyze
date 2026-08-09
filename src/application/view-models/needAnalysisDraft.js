import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
  emptySelection,
  selectionFromKeys,
} from '@/domain/constants/needCategories'
import { FORM_STATUS } from '@/domain/constants/formStatus'
import { step1Schema, step2Schema } from '@/application/validation/needAnalysis'

/** Steps in the wizard, the last of which is the report rather than a question. */
export const TOTAL_STEPS = 4

/**
 * The step-keyed shape the four form pages edit.
 *
 * A view model, not an entity: it exists because the UI is a wizard, and it
 * groups the persisted fields by the step that edits them. Entities arrive here
 * as JSON, so dates are ISO strings.
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
      fixedMonthlyExpenses: lifeCover.fixedMonthlyExpenses ?? '',
      bankInterestRate: lifeCover.bankInterestRate ?? '',
      unsecuredBankLoan: lifeCover.unsecuredBankLoan ?? '',
      cashInHandInsurance: lifeCover.cashInHandInsurance ?? '',
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

/**
 * The furthest step a draft entitles the customer to be on.
 *
 * Doubles as where a returning visit resumes and as the guard against
 * deep-linking ahead, so a step counts as reached only if the data behind it
 * would still pass the schema that step submits against.
 *
 * @param {ReturnType<typeof emptyDraft>} draft
 * @returns {number}
 */
export function furthestReachableStep(draft) {
  if (!step1Schema.safeParse(draft.step1).success) return 1
  if (!step2Schema.safeParse(draft.step2).success) return 2
  return draft.step4.completed ? TOTAL_STEPS : 3
}
