/**
 * Conversion between the children age list as the form edits it and as the
 * database stores it.
 *
 * The stored shape is deliberately unchanged: `number_of_children` stays a
 * number and `children_ages` stays a comma-separated string, so the mapper,
 * the entity and the printed form all carry on as they were. Only the editing
 * shape is new.
 */

/** Nobody is filling this form for a sixteenth child. */
export const MAX_CHILDREN = 15

/** Above this an "age" is a typo, not a person. */
export const MAX_AGE = 99

/**
 * Parse the stored string into one slot per child.
 *
 * Always returns exactly `count` entries: a saved row whose list disagrees with
 * its count — possible for anything written before the stepper existed — is
 * padded or trimmed rather than rendering a ragged form.
 *
 * @param {string} ages   e.g. "5, 8, 12"
 * @param {number} count
 * @returns {string[]}
 */
export function parseChildrenAges(ages, count) {
  const parsed = String(ages ?? '')
    .split(',')
    .map((age) => age.trim())
    .filter(Boolean)

  const total = clampCount(count)
  return Array.from({ length: total }, (_, index) => parsed[index] ?? '')
}

/**
 * Serialise back to the stored string.
 *
 * Blank slots are dropped rather than written as empty entries, so a
 * half-filled form does not persist "5, , 12".
 *
 * @param {Array<string | number>} ages
 * @returns {string}
 */
export function formatChildrenAges(ages) {
  return (ages ?? [])
    .map((age) => String(age ?? '').trim())
    .filter(Boolean)
    .join(', ')
}

/** @param {unknown} count */
export function clampCount(count) {
  const value = Number(count)
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(Math.trunc(value), 0), MAX_CHILDREN)
}
