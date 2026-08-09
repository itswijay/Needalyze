-- Persist the four step-3 calculator inputs.
--
-- The table previously kept only the computed `human_life_value`, so the
-- inputs that produced it lived in the client draft and were lost on reload —
-- which meant a customer who refreshed on the success screen downloaded a PDF
-- with those four rows blank. Storing them makes the report reproducible.
--
-- Nullable with no backfill: rows completed before this migration have no
-- record of their inputs, and the PDF falls back to blanks for those as before.

alter table need_analysis_form
  add column fixed_monthly_expenses numeric,
  add column bank_interest_rate     numeric,
  add column unsecured_bank_loan    numeric,
  add column cash_in_hand_insurance numeric;
