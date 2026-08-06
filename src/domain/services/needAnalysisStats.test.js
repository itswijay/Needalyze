import { describe, expect, it } from 'vitest'

import { summarize } from './needAnalysisStats'
import { FORM_STATUS } from '../constants/formStatus'
import {
  emptySelection,
  HEALTH_COVERS,
  HEALTH_COVER_KEYS,
  INSURANCE_NEEDS,
  INSURANCE_NEED_KEYS,
} from '../constants/needCategories'

const analysis = ({ status = FORM_STATUS.COMPLETED, needs = [], covers = [] }) => ({
  status,
  coverage: {
    insuranceNeeds: {
      ...emptySelection(INSURANCE_NEED_KEYS),
      ...Object.fromEntries(needs.map((key) => [key, true])),
    },
    healthCovers: {
      ...emptySelection(HEALTH_COVER_KEYS),
      ...Object.fromEntries(covers.map((key) => [key, true])),
    },
  },
})

describe('summarize', () => {
  it('returns zeroes for no forms', () => {
    const result = summarize([])

    expect(result.completedForms).toBe(0)
    expect(result.inProgress).toBe(0)
    expect(Object.values(result.categories).every((count) => count === 0)).toBe(true)
  })

  it('tolerates being called with nothing', () => {
    expect(summarize().completedForms).toBe(0)
  })

  it('splits completed from in-progress', () => {
    const result = summarize([
      analysis({ status: FORM_STATUS.COMPLETED }),
      analysis({ status: FORM_STATUS.COMPLETED }),
      analysis({ status: FORM_STATUS.PENDING }),
    ])

    expect(result.completedForms).toBe(2)
    expect(result.inProgress).toBe(1)
  })

  // The tiles are a report of finished work, so a form still being filled in
  // must not contribute to them.
  it('counts categories only for completed forms', () => {
    const result = summarize([
      analysis({
        status: FORM_STATUS.PENDING,
        needs: [INSURANCE_NEEDS.PENSION_FUND],
      }),
    ])

    expect(result.categories.pensionfund).toBe(0)
  })

  it('counts each insurance need separately', () => {
    const result = summarize([
      analysis({
        needs: [
          INSURANCE_NEEDS.HIGHER_EDUCATION_CHILDREN,
          INSURANCE_NEEDS.PENSION_FUND,
        ],
      }),
      analysis({ needs: [INSURANCE_NEEDS.PENSION_FUND] }),
      analysis({ needs: [INSURANCE_NEEDS.SHORT_TERM_SAVINGS] }),
    ])

    expect(result.categories.education).toBe(1)
    expect(result.categories.pensionfund).toBe(2)
    expect(result.categories.shortTermSavings).toBe(1)
    expect(result.categories.longTermSavings).toBe(0)
    expect(result.categories.DependentsCostofLiving).toBe(0)
  })

  // "Health" is the one tile that is not a single key: it means the customer
  // asked for any health cover at all.
  it('counts a form once under health regardless of how many covers it has', () => {
    const result = summarize([
      analysis({
        covers: [HEALTH_COVERS.SURGERY_COVER, HEALTH_COVERS.CRITICAL_ILLNESS],
      }),
      analysis({ covers: [HEALTH_COVERS.DAILY_HOSPITALIZATION_EXPENSES] }),
      analysis({ covers: [] }),
    ])

    expect(result.categories.health).toBe(2)
  })
})
