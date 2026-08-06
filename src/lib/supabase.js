/**
 * @deprecated Compatibility shim for the clean-architecture migration.
 *
 * The browser client now lives at infrastructure/supabase/browserClient and is
 * for authentication only. Files still importing `supabase` from here are the
 * ones that have not been migrated to a use case yet; this shim is deleted in
 * the final sweep once that list is empty.
 */
export { browserClient as supabase } from '@/infrastructure/supabase/browserClient'
