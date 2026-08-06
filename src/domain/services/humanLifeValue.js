/**
 * Human Life Value — the amount of life cover a customer needs.
 *
 * Previously computed inside two `useEffect` blocks in the step-3 page, which
 * meant the browser was the only thing that knew the formula and the server
 * stored whatever `actualHLValue` the client happened to post. These functions
 * are now the single definition, used by the live preview *and* by the server
 * when it persists the result.
 */

function toFiniteNumber(value) {
  const number = typeof value === 'string' ? Number(value) : value
  return typeof number === 'number' && Number.isFinite(number) ? number : 0
}

/**
 * Capitalised value of the customer's fixed annual outgoings: the lump sum that,
 * at the given interest rate, would throw off enough interest to cover them.
 *
 *   HLV = (fixed monthly expenses x 12) / (bank interest rate / 100)
 *
 * @param {{ fixedMonthlyExpenses?: number | string, bankInterestRate?: number | string }} inputs
 * @returns {number} rounded to the nearest rupee; 0 when the inputs are incomplete
 */
export function calculateHlv({ fixedMonthlyExpenses, bankInterestRate } = {}) {
  const expenses = toFiniteNumber(fixedMonthlyExpenses)
  const rate = toFiniteNumber(bankInterestRate)

  if (expenses <= 0 || rate <= 0) return 0

  const hlv = (expenses * 12) / (rate / 100)
  return Number.isFinite(hlv) && hlv >= 0 ? Math.round(hlv) : 0
}

/**
 * The HLV adjusted for what the customer already owes and already holds:
 * unsecured debt increases the need, existing cash and cover reduce it.
 *
 *   Actual HLV = HLV + unsecured bank loan - (cash in hand + insurance)
 *
 * Never negative — a customer whose assets exceed the need requires no cover,
 * not a negative amount of it.
 *
 * @param {{ hlv?: number | string, unsecuredBankLoan?: number | string, cashInHandInsurance?: number | string }} inputs
 * @returns {number}
 */
export function calculateActualHlv({
  hlv,
  unsecuredBankLoan,
  cashInHandInsurance,
} = {}) {
  const base = toFiniteNumber(hlv)
  const loan = toFiniteNumber(unsecuredBankLoan)
  const assets = toFiniteNumber(cashInHandInsurance)

  const actual = base + loan - assets
  return Number.isFinite(actual) && actual > 0 ? Math.round(actual) : 0
}

/**
 * Both figures from the raw step-3 inputs. This is what the server calls so it
 * never has to trust a client-supplied total.
 *
 * @param {{ fixedMonthlyExpenses?: number | string, bankInterestRate?: number | string, unsecuredBankLoan?: number | string, cashInHandInsurance?: number | string }} inputs
 * @returns {{ hlv: number, actualHlv: number }}
 */
export function calculateLifeCover(inputs = {}) {
  const hlv = calculateHlv(inputs)
  return { hlv, actualHlv: calculateActualHlv({ ...inputs, hlv }) }
}
