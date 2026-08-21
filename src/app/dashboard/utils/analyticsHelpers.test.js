import { describe, expect, it } from 'vitest'
import {
  formatCategoryData,
  formatSubmissionTrendData,
} from './analyticsHelpers'

describe('analyticsHelpers', () => {
  describe('formatCategoryData', () => {
    it('formats category dictionary into an array with labels and counts', () => {
      const rawCategories = {
        health: 3,
        education: 1,
        pensionfund: 1,
        DependentsCostofLiving: 2,
        longTermSavings: 0,
        shortTermSavings: 1,
      }

      const result = formatCategoryData(rawCategories)

      expect(result).toEqual([
        { category: 'Health', count: 3 },
        { category: 'Education', count: 1 },
        { category: 'Pension Fund', count: 1 },
        { category: 'Dependents Living', count: 2 },
        { category: 'Long Term Savings', count: 0 },
        { category: 'Short Term Savings', count: 1 },
      ])
    })

    it('handles empty or undefined categories gracefully', () => {
      const result = formatCategoryData({})
      expect(result).toHaveLength(6)
      expect(result.every((item) => item.count === 0)).toBe(true)
    })
  })

  describe('formatSubmissionTrendData', () => {
    it('aggregates forms by date chronologically and calculates totals/completed', () => {
      const forms = [
        { date: '2026-08-20T10:00:00Z', status: 'Completed' },
        { date: '2026-08-19T08:00:00Z', status: 'Completed' },
        { date: '2026-08-20T14:00:00Z', status: 'Pending' },
      ]

      const result = formatSubmissionTrendData(forms)

      expect(result).toEqual([
        { date: 'Aug 19', total: 1, completed: 1 },
        { date: 'Aug 20', total: 2, completed: 1 },
      ])
    })

    it('returns empty array when given null or empty forms', () => {
      expect(formatSubmissionTrendData([])).toEqual([])
      expect(formatSubmissionTrendData(null)).toEqual([])
    })
  })
})
