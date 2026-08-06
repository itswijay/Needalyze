import { createNeedAnalysis } from '@/domain/entities/needAnalysis'
import { FORM_STATUS } from '@/domain/constants/formStatus'
import {
  HEALTH_COVER_KEYS,
  INSURANCE_NEED_KEYS,
  selectedKeys,
  selectionFromKeys,
} from '@/domain/constants/needCategories'

/**
 * The one place that knows the `need_analysis_form` column names.
 *
 * Replaces three separate hand-written conversions: `convertDbDataToFormState`
 * in FormContext, the per-step `updateData` blocks in the API route, and the
 * row-to-table-row mapping in Dashtable.
 */

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

/**
 * `need_analysis_form` row -> NeedAnalysis entity.
 *
 * @param {Object | null} row
 * @returns {import('@/domain/entities/needAnalysis').NeedAnalysis | null}
 */
export function toNeedAnalysis(row) {
  if (!row) return null

  return createNeedAnalysis({
    formId: row.form_id,
    linkId: row.link_id,
    advisorUserId: row.user_id,
    personal: {
      fullName: row.full_name || '',
      dateOfBirth: toDate(row.date_of_birth),
      spouseName: row.spouse_name || '',
      address: row.address || '',
      phoneNumber: row.phone_number || '',
      numberOfChildren: toNumberOrNull(row.number_of_children),
      childrenAges: row.children_ages || '',
      occupation: row.occupation || '',
      age: toNumberOrNull(row.age),
      monthlyIncome: toNumberOrNull(row.monthly_income),
    },
    coverage: {
      insuranceNeeds: selectionFromKeys(row.insurance_needs, INSURANCE_NEED_KEYS),
      healthCovers: selectionFromKeys(row.health_covers, HEALTH_COVER_KEYS),
    },
    lifeCover: {
      humanLifeValue: toNumberOrNull(row.human_life_value) ?? 0,
    },
    status: row.status || FORM_STATUS.PENDING,
    createdAt: toDate(row.created_at),
  })
}

/**
 * A partial NeedAnalysis -> the columns it writes.
 *
 * Takes the domain shape, so use cases can describe *what changed* without
 * knowing any column names. Only the sections present in the patch are
 * translated, which is what makes one-step-at-a-time saves possible.
 *
 * Note `human_life_value` holds the *adjusted* figure, and the four step-3
 * inputs have no columns of their own — the table keeps only the total.
 *
 * @param {Partial<import('@/domain/entities/needAnalysis').NeedAnalysis>} patch
 * @returns {Object} column/value pairs
 */
export function toColumns(patch) {
  const columns = {}

  if (patch.personal) {
    const { personal } = patch
    // date_of_birth is a DATE column, so only the calendar date is sent —
    // a full ISO timestamp would let a timezone offset shift the birthday.
    const dob = personal.dateOfBirth ? new Date(personal.dateOfBirth) : null

    Object.assign(columns, {
      full_name: personal.fullName,
      date_of_birth: dob ? toDateOnly(dob) : null,
      spouse_name: personal.spouseName || null,
      address: personal.address,
      phone_number: personal.phoneNumber,
      number_of_children: personal.numberOfChildren ?? null,
      children_ages: personal.childrenAges || null,
      occupation: personal.occupation || null,
      age: personal.age ?? null,
      monthly_income: personal.monthlyIncome ?? null,
    })
  }

  if (patch.coverage) {
    Object.assign(columns, {
      insurance_needs: selectedKeys(
        patch.coverage.insuranceNeeds,
        INSURANCE_NEED_KEYS
      ),
      health_covers: selectedKeys(patch.coverage.healthCovers, HEALTH_COVER_KEYS),
    })
  }

  if (patch.lifeCover) {
    columns.human_life_value = patch.lifeCover.humanLifeValue ?? 0
  }

  if (patch.status) {
    columns.status = patch.status
  }

  return columns
}

/**
 * Local calendar date as YYYY-MM-DD. Deliberately not `toISOString().slice(0,10)`,
 * which converts to UTC first and so can report the previous day for anyone east
 * of Greenwich — Sri Lanka is UTC+5:30, where a date picked at midnight local
 * time would be stored as the day before.
 *
 * @param {Date} date
 */
function toDateOnly(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
