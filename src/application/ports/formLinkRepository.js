/**
 * Port: persistence for form links.
 *
 * @typedef {Object} FormLinkRepository
 * @property {(slug: string) => Promise<import('@/domain/entities/formLink').FormLink | null>} findBySlug
 * @property {(input: { advisorUserId: string, expiresAt: Date }) => Promise<import('@/domain/entities/formLink').FormLink>} create
 */

export {}
