import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

/**
 * The country list behind the phone field.
 *
 * Deliberately no data file. Shipping and hand-maintaining 245 rows of names
 * and dial codes is exactly the kind of table that goes stale, and all three
 * pieces are already available:
 *
 *   ISO codes + dial codes  libphonenumber-js, which owns them anyway because
 *                           it validates against them
 *   display names           Intl.DisplayNames, built into the platform
 *   flags                   arithmetic on the ISO code, see toFlag below
 */

/** The market this app serves; the phone field opens here. */
export const DEFAULT_COUNTRY = 'LK'

/**
 * A country's flag, derived rather than stored.
 *
 * Regional indicator symbols live in a contiguous Unicode block starting at
 * U+1F1E6 for "A", so an ISO code maps onto its flag by offsetting each letter
 * from 'A'. Windows ships no flag glyphs and renders the pair as the two
 * letters instead — still legible, and not worth chasing.
 *
 * @param {string} iso  two-letter ISO 3166-1 alpha-2 code
 */
export function toFlag(iso) {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65)
  )
}

/**
 * Intl.DisplayNames is not free to construct, so it is built once rather than
 * per row of a 245-item list.
 */
const regionNames =
  typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null

/** @param {string} iso */
export function toCountryName(iso) {
  // `.of()` returns the input back when it has no name for a code, which is a
  // better fallback than blanking the row.
  return regionNames?.of(iso) ?? iso
}

let cachedList = null

/**
 * Every dialable country, sorted by name.
 *
 * Memoised because the list is stable for the lifetime of the page and the
 * phone field may mount several times.
 *
 * @returns {Array<{ iso: string, name: string, dialCode: string, flag: string }>}
 */
export function countryList() {
  if (cachedList) return cachedList

  cachedList = getCountries()
    .map((iso) => ({
      iso,
      name: toCountryName(iso),
      dialCode: `+${getCountryCallingCode(iso)}`,
      flag: toFlag(iso),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return cachedList
}

/** @param {string} iso */
export function findCountry(iso) {
  return countryList().find((country) => country.iso === iso) ?? null
}
