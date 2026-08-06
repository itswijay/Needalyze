# PDF Generation and Storage

How a completed need analysis becomes a PDF, and where it goes.

> Rewritten during the clean-architecture migration. The previous version of this
> guide described an API that was never implemented — `generatePDF(formData, {
> uploadToStorage, downloadPDF, userId, bucketName })`, a `listUserPDFs` helper,
> and a lowercase `pdfs` bucket. None of those existed. What follows is the code
> as it actually is.

## The flow

Rendering has to happen in the browser, because html2canvas needs a live DOM.
Storing happens on the server, so the browser never holds storage credentials
and never chooses where a file lands.

```
step4/page.jsx
   └─ useNeedAnalysisPdf(linkId).generate(draft)
        1. renderNeedAnalysisHtml(draft)              → HTML string
        2. createHtml2CanvasPdfRenderer().render(html) → Blob
        3. POST /api/form/[linkId]/pdf (multipart)     → { filename, url, path }
        4. downloads the blob locally
```

Step 3 failing does not cost the customer their download — `generate` returns a
`storageError` and step 4 still runs.

### Server side

`POST /api/form/[linkId]/pdf` → `storeNeedAnalysisPdf`:

1. Validates the link id, and that the link is active and unexpired.
2. Loads the saved analysis; refuses if there is nothing to save.
3. Rejects uploads over 5 MB or with a content type other than `application/pdf`.
4. Derives the filename from the customer's name and today's date, and the path
   from the link id.
5. Uploads via the `fileStorage` port.

The caller supplies the bytes and nothing else. It cannot pick the key, so it
cannot overwrite another customer's report.

## Layout

Bucket: **`Pdfs`** (capital P — this is what `supabasePdfStorage.js` uses).

```
Pdfs/
  need-analysis/
    <linkId>/
      Need_Analysis_<Customer_Name>_<DD-MM-YYYY>.pdf
```

Namespacing by link is what keeps one customer's report from clobbering
another's when two share a name.

## Where the code lives

| Concern | File |
| --- | --- |
| The markup | `infrastructure/pdf/needAnalysisTemplate.js` |
| HTML → Blob | `infrastructure/pdf/html2canvasPdfRenderer.js` |
| Validation + path | `application/use-cases/need-analysis/storeNeedAnalysisPdf.js` |
| Upload | `infrastructure/supabase/supabasePdfStorage.js` |
| Browser orchestration | `hooks/useNeedAnalysisPdf.js` |

The renderer knows nothing about storage; the use case knows nothing about
html2canvas; the storage adapter knows nothing about PDFs beyond the content
type. To render something other than a need analysis, write another template.

## Storage policies

The upload runs with the service-role key (the customer filling the form is
anonymous), so RLS is not what protects it — the checks in the use case are.
Reads are public, since the returned URL is a public one:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('Pdfs', 'Pdfs', true);

CREATE POLICY "Public read of generated reports" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'Pdfs');
```

Anyone with the URL can read the report it points at. If that is not acceptable,
make the bucket private and hand out signed URLs from the route handler instead
— `supabasePdfStorage.upload` is the only place that would change.

## Quota

Free tier is 1 GB, Pro 8 GB. Reports are roughly 100-300 KB each at the current
`scale: 2.5` / JPEG 0.85 settings — see
[STORAGE_OPTIMIZATION.md](STORAGE_OPTIMIZATION.md) for the trade-offs. Nothing
prunes old files today.
