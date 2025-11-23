import { supabase } from './supabase'

/**
 * Upload a PDF blob to Supabase storage
 * @param {Blob} pdfBlob - The PDF blob to upload
 * @param {string} filename - The filename for the PDF
 * @param {string} folder - Optional folder path (default: 'need-analysis')
 * @returns {Promise<{success: boolean, url?: string, path?: string, error?: string}>}
 */
export async function uploadPDFToStorage(pdfBlob, filename, folder = 'need-analysis') {
  try {
    const filePath = `${folder}/${filename}`
    
    const { data, error } = await supabase.storage
      .from('Pdfs')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true // Overwrite if file exists
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: error.message }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('Pdfs')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a PDF from Supabase storage
 * @param {string} filePath - The path of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deletePDFFromStorage(filePath) {
  try {
    const { error } = await supabase.storage
      .from('Pdfs')
      .remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * List all PDFs for a user or folder
 * @param {string} folder - The folder to list files from
 * @returns {Promise<{success: boolean, files?: Array, error?: string}>}
 */
export async function listPDFsFromStorage(folder = 'need-analysis') {
  try {
    const { data, error } = await supabase.storage
      .from('Pdfs')
      .list(folder, {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Supabase list error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, files: data }
  } catch (error) {
    console.error('List error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Download a PDF from Supabase storage
 * @param {string} filePath - The path of the file to download
 * @returns {Promise<{success: boolean, blob?: Blob, error?: string}>}
 */
export async function downloadPDFFromStorage(filePath) {
  try {
    const { data, error } = await supabase.storage
      .from('Pdfs')
      .download(filePath)

    if (error) {
      console.error('Supabase download error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, blob: data }
  } catch (error) {
    console.error('Download error:', error)
    return { success: false, error: error.message }
  }
}