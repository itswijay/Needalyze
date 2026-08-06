import { FORM_STATUS } from '../constants/formStatus'
import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
  emptySelection,
} from '../constants/needCategories'

/**
 * One customer's completed (or in-progress) need analysis.
 *
 * The camelCase shape every layer above the database speaks. Translation to and
 * from the `need_analysis_form` row happens in exactly one place —
 * infrastructure/supabase/mappers/needAnalysisMapper.js — instead of the three
 * hand-written conversions that previously existed in FormContext, the API
 * route and Dashtable.
 *
 * @typedef {Object} PersonalDetails
 * @property {string} fullName
 * @property {Date | null} dateOfBirth
 * @property {string} spouseName
 * @property {string} address
 * @property {string} phoneNumber
 * @property {number | null} numberOfChildren
 * @property {string} childrenAges
 * @property {string} occupation
 * @property {number | null} age
 * @property {number | null} monthlyIncome
 *
 * @typedef {Object} Coverage
 * @property {Record<string, boolean>} insuranceNeeds
 * @property {Record<string, boolean>} healthCovers
 *
 * @typedef {Object} LifeCover
 * @property {number} humanLifeValue - the *adjusted* figure (what
 *   calculateActualHlv returns). This is the only life-cover number the
 *   database keeps: `need_analysis_form` has no columns for the four step-3
 *   inputs, so they live in the draft and in the request that computes this
 *   value, but are not persisted.
 *
 * @typedef {Object} NeedAnalysis
 * @property {string | null} formId
 * @property {string | null} linkId
 * @property {string | null} advisorUserId
 * @property {PersonalDetails} personal
 * @property {Coverage} coverage
 * @property {LifeCover} lifeCover
 * @property {string} status
 * @property {Date | null} createdAt
 */

/** @returns {PersonalDetails} */
export function emptyPersonalDetails() {
  return {
    fullName: '',
    dateOfBirth: null,
    spouseName: '',
    address: '',
    phoneNumber: '',
    numberOfChildren: null,
    childrenAges: '',
    occupation: '',
    age: null,
    monthlyIncome: null,
  }
}

/** @returns {Coverage} */
export function emptyCoverage() {
  return {
    insuranceNeeds: emptySelection(INSURANCE_NEED_KEYS),
    healthCovers: emptySelection(HEALTH_COVER_KEYS),
  }
}

/** @returns {LifeCover} */
export function emptyLifeCover() {
  return { humanLifeValue: 0 }
}

/**
 * A blank analysis, used as the starting state of a fresh form.
 *
 * @returns {NeedAnalysis}
 */
export function emptyNeedAnalysis() {
  return {
    formId: null,
    linkId: null,
    advisorUserId: null,
    personal: emptyPersonalDetails(),
    coverage: emptyCoverage(),
    lifeCover: emptyLifeCover(),
    status: FORM_STATUS.PENDING,
    createdAt: null,
  }
}

/**
 * @param {Partial<NeedAnalysis>} props
 * @returns {NeedAnalysis}
 */
export function createNeedAnalysis(props = {}) {
  const blank = emptyNeedAnalysis()
  return {
    ...blank,
    ...props,
    personal: { ...blank.personal, ...props.personal },
    coverage: { ...blank.coverage, ...props.coverage },
    lifeCover: { ...blank.lifeCover, ...props.lifeCover },
  }
}

/**
 * @param {NeedAnalysis} analysis
 * @returns {boolean}
 */
export function isCompleted(analysis) {
  return analysis?.status === FORM_STATUS.COMPLETED
}
