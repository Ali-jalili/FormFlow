-- ============================================================================
-- FormFlow · 0006 · Drop the unused `forms.is_saved` column
--
-- The client never reads or writes `is_saved` (verified by search across
-- src/). It's a leftover legacy flag. Dropping it keeps the schema honest.
--
-- Run AFTER 0005. Idempotent: no error if the column is already gone.
-- ============================================================================

alter table public.forms
  drop column if exists is_saved;
