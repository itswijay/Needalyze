# PDF Generation with Supabase Storage Guide

This guide explains how to use the updated PDF generator to upload PDFs to Supabase storage bucket.

## Prerequisites

1. **Supabase Storage Bucket**: Create a storage bucket named `pdfs` in your Supabase project
2. **Storage Policies**: Set up appropriate RLS policies for the storage bucket
3. **Environment Variables**: Ensure your Supabase credentials are properly configured

## Basic Usage

### 1. Download PDF Only (Original Behavior)
```javascript
import { generatePDF } from '@/lib/pdfGenerator'

const result = await generatePDF(formData)
// This will download the PDF to user's device
```

### 2. Upload to Storage Only (No Download)
```javascript
import { generatePDF } from '@/lib/pdfGenerator'

const result = await generatePDF(formData, {
  uploadToStorage: true,
  downloadPDF: false,
  userId: user.id, // Optional: organize by user
  bucketName: 'pdfs' // Optional: default is 'pdfs'
})

if (result.uploadSuccess) {
  console.log('PDF uploaded successfully!')
  console.log('Public URL:', result.publicUrl)
  console.log('Storage Path:', result.path)
}
```

### 3. Both Download and Upload
```javascript
import { generatePDF } from '@/lib/pdfGenerator'

const result = await generatePDF(formData, {
  uploadToStorage: true,
  downloadPDF: true,
  userId: user.id
})

// User gets download + PDF is stored in Supabase
```

## Advanced Usage

### Upload with Custom Organization
```javascript
const options = {
  uploadToStorage: true,
  downloadPDF: false,
  userId: user.id, // Files will be stored in /userId/filename.pdf
  bucketName: 'company-documents' // Use custom bucket
}

const result = await generatePDF(formData, options)
```

### Using Additional Storage Functions

#### List User's PDFs
```javascript
import { listUserPDFs } from '@/lib/pdfGenerator'

const userPDFs = await listUserPDFs(userId, 'pdfs')
if (userPDFs.listSuccess) {
  userPDFs.files.forEach(file => {
    console.log(`File: ${file.name}, URL: ${file.publicUrl}`)
  })
}
```

#### Delete a PDF
```javascript
import { deletePDFFromStorage } from '@/lib/pdfGenerator'

const result = await deletePDFFromStorage('userId/filename.pdf', 'pdfs')
if (result.deleteSuccess) {
  console.log('PDF deleted successfully')
}
```

## Setting up Supabase Storage

### 1. Create Storage Bucket
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true);
```

### 2. Set up Storage Policies
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to view their own files
CREATE POLICY "Users can view their files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to files in public folder
CREATE POLICY "Public access to public folder" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'pdfs' AND (storage.foldername(name))[1] = 'public');
```

## File Organization

The PDFs are organized as follows:
- With userId: `/userId/filename.pdf`
- Without userId: `/public/filename.pdf`

## Error Handling

```javascript
const result = await generatePDF(formData, {
  uploadToStorage: true,
  userId: user.id
})

if (!result.uploadSuccess) {
  console.error('Upload failed:', result.error)
  // Handle upload error
} else {
  console.log('PDF stored at:', result.publicUrl)
}
```

## Response Format

The `generatePDF` function returns an object with these properties:

```javascript
{
  success: true,
  filename: "Need_Analysis_John_Doe_21-11-2025_1732123456789.pdf",
  blob: Blob, // PDF blob object
  
  // If uploadToStorage is true:
  uploadSuccess: true,
  path: "userId/filename.pdf",
  publicUrl: "https://...supabase.../storage/v1/object/public/pdfs/userId/filename.pdf",
  fullPath: "userId/filename.pdf"
}
```

## Complete Example: Form Submission with Storage

```javascript
// In your form component
import { generatePDF } from '@/lib/pdfGenerator'
import { useAuth } from '@/context/AuthContext'

const handleGeneratePDF = async () => {
  const { user } = useAuth()
  
  try {
    const result = await generatePDF(formData, {
      uploadToStorage: true,
      downloadPDF: true, // Give user immediate download
      userId: user?.id,
      bucketName: 'pdfs'
    })

    if (result.uploadSuccess) {
      // Save PDF URL to database
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          user_id: user.id,
          form_data: formData,
          pdf_url: result.publicUrl,
          pdf_path: result.fullPath,
          created_at: new Date().toISOString()
        })

      if (!error) {
        alert('PDF generated and saved successfully!')
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF')
  }
}
```

## Storage Quota Management

Monitor your Supabase storage usage to avoid quota limits:
- Free tier: 1GB storage
- Pro tier: 8GB storage (additional storage available)

Consider implementing file cleanup policies for old PDFs to manage storage efficiently.