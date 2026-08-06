# Storage Optimization

Ideas for reducing what Needalyze writes, to localStorage and to the `Pdfs`
bucket. None of these are implemented — this is a list of options with their
trade-offs, not a description of the code.

> Paths updated during the clean-architecture migration. `pdfGenerator.js` no
> longer exists; the rasteriser is now
> `src/infrastructure/pdf/html2canvasPdfRenderer.js`.

## What actually gets written today

**localStorage** — `FormContext` mirrors the whole customer draft under
`needalyze-form-data` on every change. The draft is small (one customer's
answers, a few hundred bytes), and it exists so a refresh mid-form is not a data
loss. It is cleared on "Fill Again".

**Supabase storage** — one PDF per generated report, roughly 100-300 KB at
`scale: 2.5` with JPEG quality 0.85. Nothing prunes old files.

Neither is close to a limit at current volumes. Reach for the below when that
stops being true.

## PDF size

The single biggest lever, in `html2canvasPdfRenderer.js`:

```javascript
const canvas = await html2canvas(element, {
  scale: 2.5,   // 1.5 roughly halves the file; 1 quarters it
  ...
})

const imgData = canvas.toDataURL('image/jpeg', 0.85)  // 0.7 saves ~25% more
```

The report is dense text at 10-11px, so it does not degrade gracefully. Print a
sample at any candidate setting and read the "Actual Human Life Value" line
before committing to it.

A larger change: render the PDF from text rather than a rasterised screenshot.
jsPDF can draw text directly, which would cut files to a few KB and make them
selectable and searchable, at the cost of rebuilding the template as drawing
calls. `needAnalysisTemplate.js` is the only file that would change — the
renderer port stays the same shape.

## Retention

Nothing deletes old reports. Options, cheapest first:

1. A Supabase scheduled function removing objects under `need-analysis/` older
   than N months.
2. Delete the previous report when a link's form is reset, since it is
   superseded — `resetNeedAnalysis` is the natural place.
3. Skip storage entirely for links that are never revisited, and store only on
   an explicit "save to cloud" action.

## localStorage

Only worth touching if drafts grow substantially:

- **Debounce the write.** `FormContext` writes on every keystroke through its
  `useEffect`. A 500-1000ms debounce would cut writes by an order of magnitude.
  Frequency, not size, is the cost here.
- **sessionStorage instead.** A draft is only useful for the current sitting;
  sessionStorage clears itself and never accumulates across customers on a
  shared device — which is also the better privacy answer.
- **Compression.** LZ-String would cut 30-70%, at the price of a dependency and
  unreadable stored values. Not worth it at current sizes.

Note the four step-3 inputs are not persisted server-side (the table stores only
the resulting total), so the localStorage draft is the only thing that carries
them across a refresh. Do not drop it without accounting for that.
