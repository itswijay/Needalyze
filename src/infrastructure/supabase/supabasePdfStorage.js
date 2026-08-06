const BUCKET = 'Pdfs'

/**
 * Supabase Storage adapter for generated PDFs.
 *
 * Replaces lib/pdfStorage.js, which uploaded straight from the browser with the
 * anon key. Its delete/list/download helpers had no callers and are not carried
 * over.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {import('@/application/ports/fileStorage').FileStorage}
 */
export function createSupabasePdfStorage(client) {
  return {
    async upload({ path, body, contentType }) {
      const { data, error } = await client.storage
        .from(BUCKET)
        .upload(path, body, { contentType, upsert: true })

      if (error) throw error

      const {
        data: { publicUrl },
      } = client.storage.from(BUCKET).getPublicUrl(path)

      return { url: publicUrl, path: data.path }
    },
  }
}
