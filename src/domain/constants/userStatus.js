/**
 * Lifecycle of a `user_profile` row. New accounts land in PENDING and need an
 * admin decision before they can sign in.
 */
export const USER_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DELETED: 'deleted',
})

/** Statuses an admin is allowed to set on someone else's account. */
export const ADMIN_SETTABLE_STATUSES = Object.freeze([
  USER_STATUS.PENDING,
  USER_STATUS.APPROVED,
  USER_STATUS.REJECTED,
])
