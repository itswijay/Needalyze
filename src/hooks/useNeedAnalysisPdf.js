'use client'

import { useCallback, useState } from 'react'

import { createHtml2CanvasPdfRenderer } from '@/infrastructure/pdf/html2canvasPdfRenderer'
import { renderNeedAnalysisHtml } from '@/infrastructure/pdf/needAnalysisTemplate'

/**
 * Generate the customer's report: rasterise it here (html2canvas needs a DOM),
 * hand it to the server to store, and save a copy locally.
 *
 * The download is triggered here rather than deep inside the generator, because
 * "put a file in the user's downloads folder" is a UI effect.
 */
export function useNeedAnalysisPdf(linkId) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback(
    async (formData) => {
      if (isGenerating) return null

      setIsGenerating(true)
      try {
        const renderer = createHtml2CanvasPdfRenderer()
        const blob = await renderer.render(renderNeedAnalysisHtml(formData))

        let stored = null
        let storageError = null

        try {
          stored = await uploadPdf(linkId, blob)
        } catch (error) {
          // A failed upload must not cost the customer their download.
          storageError = error.message
        }

        const filename = stored?.filename || fallbackFilename(formData)
        downloadBlob(blob, filename)

        return { filename, url: stored?.url || null, storageError }
      } finally {
        setIsGenerating(false)
      }
    },
    [isGenerating, linkId]
  )

  return { generate, isGenerating }
}

async function uploadPdf(linkId, blob) {
  const body = new FormData()
  body.append('file', blob, 'report.pdf')

  const response = await fetch(`/api/form/${linkId}/pdf`, {
    method: 'POST',
    body,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Failed to save the PDF')
  }

  return payload
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Used only when the upload failed, so the server never named the file. */
function fallbackFilename(formData) {
  const name = (formData?.step1?.fullName || 'Customer').replace(/\s+/g, '_')
  const date = new Date().toLocaleDateString('en-IN').replace(/\//g, '-')
  return `Need_Analysis_${name}_${date}.pdf`
}
