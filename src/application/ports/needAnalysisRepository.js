/**
 * Port: persistence for need analyses.
 *
 * Declared as a contract so use cases depend on the shape, not on Supabase.
 * The adapter lives in infrastructure/supabase/repositories.
 *
 * @typedef {Object} NeedAnalysisRepository
 * @property {(linkId: string) => Promise<import('@/domain/entities/needAnalysis').NeedAnalysis | null>} findByLinkId
 * @property {(userId: string) => Promise<import('@/domain/entities/needAnalysis').NeedAnalysis[]>} listByAdvisor
 * @property {(analysis: Partial<import('@/domain/entities/needAnalysis').NeedAnalysis>) => Promise<import('@/domain/entities/needAnalysis').NeedAnalysis>} create
 * @property {(linkId: string, changes: Object) => Promise<import('@/domain/entities/needAnalysis').NeedAnalysis>} updateByLinkId
 */

export {}
