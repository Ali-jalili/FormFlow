-- ============================================================================
-- FormFlow · 0001 · Schema, indexes, updated_at, RLS
-- Idempotent: safe on both a fresh project and your existing database.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables (fresh installs)
-- ---------------------------------------------------------------------------
create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'Untitled Form',
  description text,
  is_published boolean not null default false,
  public_id text unique,
  is_saved boolean not null default false,  -- legacy, not used by client
  created_at timestamptz not null default now()
);

create table if not exists public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  type text not null check (type in ('short_text', 'long_text', 'multiple_choice')),
  label text not null default '',
  options jsonb,
  required boolean not null default false,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Existing installs: add missing columns safely
-- ---------------------------------------------------------------------------
alter table public.forms
  add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- Missing FK: forms.user_id -> auth.users.id
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'forms_user_id_fkey'
      and conrelid = 'public.forms'::regclass
  ) then
    alter table public.forms
      add constraint forms_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete cascade;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_form_fields_form_id
  on public.form_fields (form_id, "order");

create index if not exists idx_responses_form_id
  on public.responses (form_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
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
-- RLS
-- ---------------------------------------------------------------------------
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.responses enable row level security;

-- ---------------------------------------------------------------------------
-- forms
-- ---------------------------------------------------------------------------
drop policy if exists "Users can view their own forms" on public.forms;
create policy "Users can view their own forms"
  on public.forms for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Anyone can view published forms" on public.forms;
create policy "Anyone can view published forms"
  on public.forms for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Enable insert for authenticated users only" on public.forms;
create policy "Enable insert for authenticated users only"
  on public.forms for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own forms" on public.forms;
create policy "Users can update their own forms"
  on public.forms for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own forms" on public.forms;
create policy "Users can delete their own forms"
  on public.forms for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- form_fields
-- ---------------------------------------------------------------------------
drop policy if exists "Users can view fields of their forms" on public.form_fields;
create policy "Users can view fields of their forms"
  on public.form_fields for select to authenticated
  using (form_id in (select id from public.forms where user_id = auth.uid()));

drop policy if exists "Anyone can view fields of published forms" on public.form_fields;
create policy "Anyone can view fields of published forms"
  on public.form_fields for select to anon, authenticated
  using (form_id in (select id from public.forms where is_published = true));

drop policy if exists "Users can create fields for their forms" on public.form_fields;
create policy "Users can create fields for their forms"
  on public.form_fields for insert to authenticated
  with check (form_id in (select id from public.forms where user_id = auth.uid()));

-- MISSING in current DB — required by upsert inside saveFormFields
drop policy if exists "Users can update fields of their forms" on public.form_fields;
create policy "Users can update fields of their forms"
  on public.form_fields for update to authenticated
  using (form_id in (select id from public.forms where user_id = auth.uid()))
  with check (form_id in (select id from public.forms where user_id = auth.uid()));

drop policy if exists "Users can delete fields of their forms" on public.form_fields;
create policy "Users can delete fields of their forms"
  on public.form_fields for delete to authenticated
  using (form_id in (select id from public.forms where user_id = auth.uid()));

-- remove duplicate delete policy
drop policy if exists "Users can delete their own form fields" on public.form_fields;

-- ---------------------------------------------------------------------------
-- responses
-- ---------------------------------------------------------------------------
drop policy if exists "Allow select for form owner" on public.responses;
create policy "Allow select for form owner"
  on public.responses for select to authenticated
  using (form_id in (select id from public.forms where user_id = auth.uid()));

drop policy if exists "Anyone can submit responses to published forms" on public.responses;
create policy "Anyone can submit responses to published forms"
  on public.responses for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.forms
      where forms.id = responses.form_id
        and forms.is_published = true
    )
  );