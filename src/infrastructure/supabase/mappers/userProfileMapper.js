import { createUserProfile } from '@/domain/entities/userProfile'

/**
 * The one place that knows the `user_profile` column names.
 *
 * Note there is no `email` column on this table — lib/admin.js asked for one in
 * its select list, which PostgREST rejects outright.
 */

const COLUMNS = `
  user_id,
  first_name,
  last_name,
  phone_number,
  branch,
  position,
  code_number,
  role_id,
  status,
  created_at
`

export const USER_PROFILE_COLUMNS = COLUMNS

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * @param {Object | null} row
 * @returns {import('@/domain/entities/userProfile').UserProfile | null}
 */
export function toUserProfile(row) {
  if (!row) return null

  return createUserProfile({
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneNumber: row.phone_number,
    branch: row.branch,
    position: row.position,
    codeNumber: row.code_number,
    roleId: row.role_id,
    status: row.status,
    createdAt: toDate(row.created_at),
  })
}

/**
 * A partial UserProfile -> the columns it writes. Only the fields present are
 * translated, so a profile edit cannot blank a column it never touched.
 *
 * @param {Partial<import('@/domain/entities/userProfile').UserProfile>} patch
 */
export function toColumns(patch) {
  const columns = {}
  const map = {
    userId: 'user_id',
    firstName: 'first_name',
    lastName: 'last_name',
    phoneNumber: 'phone_number',
    branch: 'branch',
    position: 'position',
    codeNumber: 'code_number',
    roleId: 'role_id',
    status: 'status',
  }

  for (const [field, column] of Object.entries(map)) {
    if (patch[field] !== undefined) columns[column] = patch[field]
  }

  return columns
}
