# Database & Security (Supabase)

This folder contains the database schema, Row Level Security (RLS) policies,
and the server-side validation RPC for FormFlow.

## Contents

| File                                 | Purpose                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `migrations/0001_initial_schema.sql` | Tables (`forms`, `form_fields`, `responses`), indexes, `updated_at` trigger, and RLS policies.       |
| `migrations/0002_validation_rpc.sql` | `public.submit_form_response(uuid, jsonb)` — validates submissions server-side inside a transaction. |

## How to apply

If your Supabase project was **not** created with these migrations:

1. Open the Supabase dashboard → **SQL Editor**.
2. Paste and run `migrations/0001_initial_schema.sql`, then
   `migrations/0002_validation_rpc.sql`.
3. (Optional) Revoke the raw insert policy and call the RPC from the client
   instead, so validation is guaranteed:
   ```js
   await supabase.rpc("submit_form_response", {
     p_public_id: publicId,
     p_data: answers,
   });
   ```

## Security model

- **Forms** — owner (`authenticated` + matching `user_id`) has full access;
  anonymous users can only *read* published forms and only a minimal column
  list (`id, title, is_published`), so `user_id` never reaches the public page.
- **Fields** — owner manages; anonymous can read only the fields of a
  published form, ordered by `order`.
- **Responses** — owner reads their own; anonymous inserts are constrained to
  published forms, and the `submit_form_response` RPC enforces
  required/type/size rules the client cannot bypass.

> RLS is enabled on every table. `security definer` on the RPC reads the form
> row as `postgres` but only ever returns the new response `id`.
