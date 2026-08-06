/**
 * Lifecycle of a `need_analysis_form` row. A form is created as PENDING at
 * step 1 and flips to COMPLETED when step 3 is submitted.
 */
export const FORM_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
})

/** Lifecycle of a `form_link` row. */
export const LINK_STATUS = Object.freeze({
  ACTIVE: 'active',
  REVOKED: 'revoked',
})

/** How long a newly created form link stays usable. */
export const DEFAULT_LINK_EXPIRY_HOURS = 24 * 14
