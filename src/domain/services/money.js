/**
 * Currency presentation for Sri Lankan rupees.
 *
 * Lived in lib/utils.js next to the Tailwind `cn` helper, which meant a domain
 * convention (this app quotes everything in Rs., with no decimals) sat in a
 * styling utility module.
 *
 * @param {number | string | null | undefined} amount
 * @returns {string} e.g. "Rs. 9,000,000", or '' when there is no amount
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return ''

  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(value)) return ''

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return `Rs. ${formatted}`
}
