-- Adds a short, URL-safe public slug for customer-facing form links.
-- The existing `link_id` UUID stays as the internal primary key; the slug
-- is what appears in the shareable /form/{slug}/step1 URL instead.
--
-- No backfill: rows created before this migration have no slug and will no
-- longer resolve via the app's slug-based lookup. That's expected — this
-- app is still early-stage and any previously shared links are test data.

alter table form_link add column slug text;
alter table form_link add constraint form_link_slug_key unique (slug);
create index if not exists form_link_slug_idx on form_link (slug);
