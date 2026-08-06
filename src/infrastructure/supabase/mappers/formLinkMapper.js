import { createFormLink } from '@/domain/entities/formLink'

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * `form_link` row -> FormLink entity.
 *
 * @param {Object | null} row
 * @returns {import('@/domain/entities/formLink').FormLink | null}
 */
export function toFormLink(row) {
  if (!row) return null

  return createFormLink({
    linkId: row.link_id,
    advisorUserId: row.user_id,
    status: row.status,
    generatedAt: toDate(row.generated_date),
    expiresAt: toDate(row.expiry_date),
  })
}
