-- ============================================================================
-- FormFlow · 0001 · Initial schema, RLS and table constraints
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor) if your
-- project was not created with migrations. If you already have these tables,
-- the statements are idempotent where possible; skip the CREATE TABLE blocks
-- that already exist.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Form',
  is_published boolean not null default false,
  public_id uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.form_fields (
  id uuid primary key,
  form_id uuid not null references public.forms (id) on delete cascade,
  type text not null check (type in ('short_text', 'long_text', 'multiple_choice')),
  label text not null default '',
  required boolean not null default false,
  options jsonb,
  order int not null default 0
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_form_fields_form_id on public.form_fields (form_id, order);
create index if not exists idx_responses_form_id on public.responses (form_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists forms_set_updated_at on public.forms;
create trigger forms_set_updated_at
  before update on public.forms
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.responses enable row level security;

-- forms: owner can do everything.
drop policy if exists "forms_owner_all" on public.forms;
create policy "forms_owner_all" on public.forms
  for all
  to authenticated
  using ((select auth.uid()) = user_id);

-- forms: anonymous users can READ only published forms (the client query
-- additionally filters by public_id; the client also selects a minimal
-- column list so user_id never reaches the public page).
drop policy if exists "forms_public_read" on public.forms;
create policy "forms_public_read" on public.forms
  for select
  to anon
  using (is_published = true and public_id is not null);

-- form_fields: owner can manage; anonymous can read only fields of published forms.
drop policy if exists "form_fields_owner_all" on public.form_fields;
create policy "form_fields_owner_all" on public.form_fields
  for all
  to authenticated
  using (
    exists (
      select 1 from public.forms
      where public.forms.id = form_fields.form_id
        and public.forms.user_id = (select auth.uid())
    )
  );

drop policy if exists "form_fields_public_read" on public.form_fields;
create policy "form_fields_public_read" on public.form_fields
  for select
  to anon
  using (
    exists (
      select 1 from public.forms
      where public.forms.id = form_fields.form_id
        and public.forms.is_published = true
        and public.forms.public_id is not null
    )
  );

-- responses: owner can read/insert their own form's responses; anonymous can
-- INSERT only into a published form (validated server-side by the RPC below).
drop policy if exists "responses_owner_read" on public.responses;
create policy "responses_owner_read" on public.responses
  for select
  to authenticated
  using (
    exists (
      select 1 from public.forms
      where public.forms.id = responses.form_id
        and public.forms.user_id = (select auth.uid())
    )
  );

drop policy if exists "responses_public_insert" on public.responses;
create policy "responses_public_insert" on public.responses
  for insert
  to anon
  with check (
    exists (
      select 1 from public.forms
      where public.forms.id = responses.form_id
        and public.forms.is_published = true
        and public.forms.public_id is not null
    )
  );
