-- ============================================================================
-- FormFlow · 0003 · Responses: RPC is the only write path
--
-- Drops the policy that allowed anonymous (and authenticated) clients to
-- insert responses directly into public.responses. After this migration,
-- submissions only succeed through the `submit_form_response` RPC
-- (0002_validation_rpc.sql), which enforces required/type/size validation
-- inside a single transaction.
--
-- Run AFTER 0001 and 0002, and after the client has switched to the RPC.
-- ============================================================================

drop policy if exists "Anyone can submit responses to published forms"
  on public.responses;
