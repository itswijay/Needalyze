/**
 * Port: persistence for advisor profiles.
 *
 * @typedef {import('@/domain/entities/userProfile').UserProfile} UserProfile
 *
 * @typedef {Object} UserProfileRepository
 * @property {(userId: string) => Promise<UserProfile | null>} findByUserId
 * @property {(branch: string) => Promise<UserProfile | null>} findBranchManager
 * @property {(status: string) => Promise<UserProfile[]>} listByStatus
 * @property {(profile: UserProfile) => Promise<UserProfile>} create
 * @property {(userId: string, changes: Partial<UserProfile>) => Promise<UserProfile>} update
 * @property {(userId: string, status: string) => Promise<void>} setStatus
 * @property {() => Promise<Record<string, number>>} countByStatus
 */

export {}
