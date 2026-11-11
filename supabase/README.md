# Database & Security (Supabase)

This folder contains the database schema, Row Level Security (RLS) policies,
and the server-side validation RPC for FormFlow.

## Contents

| File                                            | Purpose |
| ----------------------------------------------- | ------- |
| `migrations/0001_initial_schema.sql`            | Tables, indexes, updated-at trigger, and RLS policies. |
| `migrations/0002_validation_rpc.sql`            | Server-side validation for public response submissions. |
| `migrations/0003_restrict_direct_insert.sql`    | Makes the submission RPC the only response-write path. |
| `migrations/0004_column_grants.sql`             | Restricts anonymous reads to public-safe form columns. |
| `migrations/0005_published_snapshot.sql`        | Optional schema column for a future frozen publish snapshot. |
| `migrations/0006_drop_is_saved.sql`             | Removes the unused legacy saved flag. |
| `migrations/0007_atomic_form_save.sql`          | Atomically saves a form title and its fields through one owner-only RPC. |
| `migrations/0008_paginated_response_search.sql` | Adds owner-only server pagination and question/answer search. |
| `migrations/0009_required_whitespace_validation.sql` | Rejects whitespace-only answers to required questions on the server. |

## How to apply

For a fresh project:

1. Open the Supabase dashboard → **SQL Editor**.
2. Run all migrations **in order** (each is idempotent), from
   `0001_initial_schema.sql` through `0009_required_whitespace_validation.sql`.
   Migrations `0007` and `0008` are required for form saving and response
   browsing; `0009` tightens the existing submission validation.
3. After applying `0003`, the submission RPC is the **only** way to submit a
   response — direct inserts into `responses` are no longer possible. The
   client calls it as:
   ```js
   const responseId = await supabase.rpc("submit_form_response", {
     p_public_id: publicId,   // TEXT
     p_data: answers,         // JSONB object keyed by field id
   });
   ```

For an existing project, apply only migrations not already installed, in order,
through `0009_required_whitespace_validation.sql`.

## Security model

- **Forms** — owner (`authenticated` + matching `user_id`) has full access;
  anonymous users can only *read* published forms and only a restricted
  column list (`id, title, public_id, is_published, created_at`), so
  `user_id` never reaches the public page.
- **Fields** — owner manages; anonymous can read only the public definition
  columns of a published form, ordered by `order`.
- **Responses** — owner reads their own (authenticated). Writes happen
  **exclusively** through the `submit_form_response` RPC: the direct-insert
  policy is dropped (0003) so required/type/size validation cannot be
  bypassed.
- **Column grants** — 0004 revokes the blanket `select` and grants anon a
  fixed, public-safe column set on `forms` and `form_fields`.
- **Atomic saves** — `save_form_draft` is `SECURITY INVOKER`, is executable
  only by authenticated users, and uses the existing owner RLS policies.
  PostgreSQL rolls back the title and field changes together if any write fails.
- **Response browsing** — `get_form_responses_page` is also `SECURITY INVOKER`
  and authenticated-only; response rows and counts remain subject to RLS.

> RLS is enabled on every table. `submit_form_response` uses `SECURITY DEFINER`
> to read the published form and only returns the new response `id`.
