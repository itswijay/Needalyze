import { describe, expect, it } from 'vitest'

import {
  TOTAL_STEPS,
  furthestReachableStep,
  toDraft,
} from './needAnalysisDraft'

/**
 * Shaped like the rows actually in the table, including the "12, 15" spacing
 * the children ages are stored with — a returning customer's landing step is
 * decided by re-validating saved data, so the spacing matters.
 */
const completed = {
  status: 'completed',
  personal: {
    fullName: 'A Customer',
    dateOfBirth: '1981-03-01',
    spouseName: '',
    address: 'Somewhere',
    phoneNumber: '+94767876789',
    numberOfChildren: 2,
    childrenAges: '12, 15',
    occupation: '',
    monthlyIncome: 1000000,
  },
  coverage: {
    insuranceNeeds: [],
    healthCovers: ['dailyHospitalizationExpenses', 'hospitalBillCover'],
  },
  lifeCover: { humanLifeValue: 300000000 },
}

describe('furthestReachableStep', () => {
  // A finished form reopened from its original link used to land on step 1,
  // with no way forward to the report the customer came back for.
  it('puts a completed form on the report', () => {
    expect(furthestReachableStep(toDraft(completed))).toBe(TOTAL_STEPS)
  })

  it('puts an unstarted link on step 1', () => {
    expect(furthestReachableStep(toDraft(null))).toBe(1)
  })

  it('resumes at the calculation when the details are in but not submitted', () => {
    expect(
      furthestReachableStep(toDraft({ ...completed, status: 'pending' }))
    ).toBe(3)
  })

  it('holds at step 1 while the personal details would not re-validate', () => {
    const partial = {
      ...completed,
      personal: { ...completed.personal, monthlyIncome: null },
    }
    expect(furthestReachableStep(toDraft(partial))).toBe(1)
  })
})
