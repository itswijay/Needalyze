import { toColumns, toNeedAnalysis } from '../mappers/needAnalysisMapper'

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {import('@/application/ports/needAnalysisRepository').NeedAnalysisRepository}
 */
export function createSupabaseNeedAnalysisRepository(client) {
  return {
    async findByLinkId(linkId) {
      const { data, error } = await client
        .from('need_analysis_form')
        .select('*')
        .eq('link_id', linkId)
        .maybeSingle()

      if (error) throw error
      return toNeedAnalysis(data)
    },

    async listByAdvisor(userId) {
      const { data, error } = await client
        .from('need_analysis_form')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(toNeedAnalysis)
    },

    /**
     * @param {{ linkId: string, advisorUserId: string, patch: Partial<import('@/domain/entities/needAnalysis').NeedAnalysis> }} input
     */
    async create({ linkId, advisorUserId, patch }) {
      const { data, error } = await client
        .from('need_analysis_form')
        .insert({
          link_id: linkId,
          user_id: advisorUserId,
          ...toColumns(patch),
        })
        .select()
        .single()

      if (error) throw error
      return toNeedAnalysis(data)
    },

    /**
     * @param {string} linkId
     * @param {Partial<import('@/domain/entities/needAnalysis').NeedAnalysis>} patch
     */
    async updateByLinkId(linkId, patch) {
      const { data, error } = await client
        .from('need_analysis_form')
        .update(toColumns(patch))
        .eq('link_id', linkId)
        .select()
        .single()

      if (error) throw error
      return toNeedAnalysis(data)
    },
  }
}
