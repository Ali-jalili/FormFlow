-- ============================================================================
-- FormFlow · 0004 · Column-level grants (defense in depth for anon)
--
-- Even with RLS enabled, anon could previously *reference* any column of
-- forms/form_fields in a PostgREST query. This tightens table privileges
-- so anonymous users can only ever read a small, public-safe column set.
--
--  · forms      -> anon: id, title, public_id, is_published, created_at
--                   (never user_id, updated_at, is_saved, description)
--  · form_fields -> anon: id, form_id, type, label, options, required, "order"
--
-- `authenticated` keeps full grants (owners manage their own data), and the
-- `submit_form_response` RPC runs as `security definer` (postgres), so it
-- is unaffected by these revokes.
--
-- Run AFTER 0001–0003. Idempotent: revoke/grant can be re-run safely.
-- ============================================================================

-- forms: anon gets a read-only, restricted column set
revoke select on public.forms from anon;
grant select (id, title, public_id, is_published, created_at)
  on public.forms to anon;

-- form_fields: anon may only read the public field definition columns
revoke select on public.form_fields from anon;
grant select (id, form_id, type, label, options, required, "order")
  on public.form_fields to anon;

-- responses stays untouched: the owner reads via RLS (authenticated),
-- and writes happen exclusively through the RPC (see 0003).
