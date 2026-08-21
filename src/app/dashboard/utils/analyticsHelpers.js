import { format } from 'date-fns'

/**
 * Maps raw cardData categories object to a recharts-friendly array of category objects.
 *
 * @param {Record<string, number>} categories
 * @returns {Array<{ category: string, count: number }>}
 */
export function formatCategoryData(categories = {}) {
  const categoryConfig = [
    { key: 'health', label: 'Health' },
    { key: 'education', label: 'Education' },
    { key: 'pensionfund', label: 'Pension Fund' },
    { key: 'DependentsCostofLiving', label: 'Dependents Living' },
    { key: 'longTermSavings', label: 'Long Term Savings' },
    { key: 'shortTermSavings', label: 'Short Term Savings' },
  ]

  return categoryConfig.map(({ key, label }) => ({
    category: label,
    count: categories[key] || 0,
  }))
}

/**
 * Aggregates dashboard form submissions by date (MMM dd) to plot trends over time.
 *
 * @param {Array<{ date: string | null, status: string }>} forms
 * @returns {Array<{ date: string, total: number, completed: number }>}
 */
export function formatSubmissionTrendData(forms = []) {
  if (!forms || forms.length === 0) return []

  // Filter valid dates and sort chronologically
  const sortedForms = [...forms]
    .filter((item) => item && item.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (sortedForms.length === 0) return []

  const dateMap = new Map()

  sortedForms.forEach((form) => {
    try {
      const dateObj = new Date(form.date)
      if (isNaN(dateObj.getTime())) return

      const dateLabel = format(dateObj, 'MMM dd')

      if (!dateMap.has(dateLabel)) {
        dateMap.set(dateLabel, {
          date: dateLabel,
          total: 0,
          completed: 0,
        })
      }

      const entry = dateMap.get(dateLabel)
      entry.total += 1
      if (
        typeof form.status === 'string' &&
        form.status.toLowerCase() === 'completed'
      ) {
        entry.completed += 1
      }
    } catch {
      // Ignore unparseable dates
    }
  })

  return Array.from(dateMap.values())
}
