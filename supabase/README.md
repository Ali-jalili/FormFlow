# Database & Security (Supabase)

This folder contains the database schema, Row Level Security (RLS) policies,
and the server-side validation RPC for FormFlow.

## Contents

| File                                         | Purpose                                                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `migrations/0001_initial_schema.sql`         | Tables (`forms`, `form_fields`, `responses`), indexes, `updated_at` trigger, and RLS policies.       |
| `migrations/0002_validation_rpc.sql`         | `public.submit_form_response(text, jsonb)` — validates submissions server-side inside a transaction. |
| `migrations/0003_restrict_direct_insert.sql` | Drops the direct-insert policy on `responses`, making the RPC the only write path.                   |
| `migrations/0004_column_grants.sql`          | Column-level grants: `anon` can only read a public-safe column set on `forms` / `form_fields`.       |

## How to apply

If your Supabase project was **not** created with these migrations:

1. Open the Supabase dashboard → **SQL Editor**.
2. Run them **in this order** (each is idempotent):
   1. `migrations/0001_initial_schema.sql`
   2. `migrations/0002_validation_rpc.sql`
   3. `migrations/0003_restrict_direct_insert.sql`
   4. `migrations/0004_column_grants.sql`
3. After step 3, the RPC is the **only** way to submit a response — direct
   inserts into `responses` are no longer possible. The client calls it as:
   ```js
   const responseId = await supabase.rpc("submit_form_response", {
     p_public_id: publicId,   // TEXT
     p_data: answers,         // JSONB object keyed by field id
   });
   ```

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

> RLS is enabled on every table. `security definer` on the RPC reads the form
> row as `postgres` but only ever returns the new response `id`.
