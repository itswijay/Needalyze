/**
 * Age in completed years, counting a birthday as reached only once the month
 * and day have both passed.
 *
 * Previously inlined in the step-1 submit handler, which mutated the validated
 * form payload to smuggle the result through to the API.
 *
 * @param {Date | string | null | undefined} dateOfBirth
 * @param {Date} [asOf] - defaults to now; injectable so the value is testable
 * @returns {number | null} null when there is no usable date of birth
 */
export function calculateAge(dateOfBirth, asOf = new Date()) {
  if (!dateOfBirth) return null

  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null

  let age = asOf.getFullYear() - dob.getFullYear()
  const monthsApart = asOf.getMonth() - dob.getMonth()

  if (monthsApart < 0 || (monthsApart === 0 && asOf.getDate() < dob.getDate())) {
    age--
  }

  return age >= 0 ? age : null
}
