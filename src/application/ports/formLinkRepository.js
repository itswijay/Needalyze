/**
 * Port: persistence for form links.
 *
 * @typedef {Object} FormLinkRepository
 * @property {(linkId: string) => Promise<import('@/domain/entities/formLink').FormLink | null>} findById
 * @property {(input: { advisorUserId: string, expiresAt: Date }) => Promise<import('@/domain/entities/formLink').FormLink>} create
 */

export {}
