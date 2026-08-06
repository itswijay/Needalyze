/**
 * Port: turn an HTML document into a PDF.
 *
 * The only implementation rasterises the HTML in a browser (html2canvas +
 * jsPDF), which is why rendering happens client-side while storing happens on
 * the server.
 *
 * @typedef {Object} PdfRenderer
 * @property {(html: string) => Promise<Blob>} render
 */

export {}
