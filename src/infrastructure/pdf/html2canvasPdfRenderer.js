import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const RENDER_TIMEOUT_MS = 30000
const LAYOUT_SETTLE_MS = 1000

/**
 * Rasterises HTML into a single-page A4 PDF, in the browser.
 *
 * This is all that is left of `generatePDF`: it used to also decide the
 * filename, upload the result to Supabase storage and trigger the browser
 * download, which meant one function owned rendering, persistence and a UI
 * side effect.
 *
 * @returns {import('@/application/ports/pdfRenderer').PdfRenderer}
 */
export function createHtml2CanvasPdfRenderer() {
  return {
    async render(html) {
      // Created outside the try so the finally clause can always clean it up,
      // even if something throws before it is attached to the DOM.
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = '210mm' // A4
      container.style.height = '297mm'
      container.style.background = 'white'
      container.style.zIndex = '-1000'
      container.style.padding = '0'
      container.style.margin = '0'
      container.innerHTML = html

      try {
        document.body.appendChild(container)

        // Give the browser a moment to lay out fonts and the logo.
        await new Promise((resolve) => setTimeout(resolve, LAYOUT_SETTLE_MS))

        const element = container.firstElementChild
        if (!element) {
          throw new Error('PDF content not rendered properly')
        }

        // Bounded, so a hung render cannot block forever.
        const canvas = await Promise.race([
          html2canvas(element, {
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            width: element.scrollWidth,
            height: element.scrollHeight,
            scrollX: 0,
            scrollY: 0,
          }),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('PDF generation timed out')),
              RENDER_TIMEOUT_MS
            )
          ),
        ])

        return toA4Pdf(canvas)
      } finally {
        container.parentNode?.removeChild(container)
      }
    },
  }
}

/**
 * Fit the canvas onto one centred A4 page with a 10mm margin.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Blob}
 */
function toA4Pdf(canvas) {
  const imgData = canvas.toDataURL('image/jpeg', 0.85)
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = 210
  const pageHeight = 297
  const margin = 10
  const maxWidth = pageWidth - 2 * margin
  const maxHeight = pageHeight - 2 * margin

  let width = maxWidth
  let height = (canvas.height * maxWidth) / canvas.width

  if (height > maxHeight) {
    height = maxHeight
    width = (canvas.width * maxHeight) / canvas.height
  }

  pdf.addImage(
    imgData,
    'JPEG',
    (pageWidth - width) / 2,
    (pageHeight - height) / 2,
    width,
    height,
    undefined,
    'FAST'
  )

  return pdf.output('blob')
}
