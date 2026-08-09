-- Let the advisor's dashboard hear about submissions as they happen.
--
-- A customer fills the form on their own device, so nothing in the advisor's
-- browser knows the row changed — the dashboard only updated on a manual
-- refresh. Adding the table to the realtime publication lets Postgres push
-- the change instead.
--
-- No new access is granted: realtime authorises each subscriber against the
-- same RLS select policy as a query ("Users can read their own forms",
-- auth.uid() = user_id), so an advisor still only ever receives their own rows.

alter publication supabase_realtime add table need_analysis_form;
