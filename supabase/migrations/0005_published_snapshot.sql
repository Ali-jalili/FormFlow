-- ============================================================================
-- FormFlow · 0005 · Optional: published snapshot column
--
-- Adds `published_snapshot jsonb` so a form can freeze its title + fields at
-- publish time, letting the public form be answered against a stable version
-- while the owner keeps editing the draft.
--
-- STATUS: optional building block. The client does NOT yet read/write this
-- column (see README → "Known limitations"), so applying this migration is
-- safe and non-breaking on its own. Wire it up in the client + RPC to enable
-- true snapshot publishing.
-- ============================================================================

alter table public.forms
  add column if not exists published_snapshot jsonb;
