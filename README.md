# FormFlow

![CI](https://github.com/Ali-jalili/FormFlow/actions/workflows/ci.yml/badge.svg)

A modern full-stack form builder built with React and Supabase, enabling users to create, publish, and manage dynamic forms with flexible field configurations and response management.

## 🌐 Live Demo

<https://form-flow-fawn.vercel.app/>

## 🖼️ Screenshots

<!-- Add screenshots/GIF here. Suggested files:
     docs/screenshots/home.png, builder.png, public-form.png, responses.png -->

| Home                               | Builder                                  |
| ---------------------------------- | ---------------------------------------- |
| ![Home](docs/screenshots/home.png) | ![Builder](docs/screenshots/builder.png) |

| Public form                                      | Responses                                    |
| ------------------------------------------------ | -------------------------------------------- |
| ![Public form](docs/screenshots/public-form.png) | ![Responses](docs/screenshots/responses.png) |

> **TODO:** drop real screenshots or a GIF into `docs/screenshots/` (the
> placeholder paths above are ready to receive them).

## 🏛️ Architecture

```mermaid
flowchart LR
  UI[React UI<br/>pages & components]
  H[Hooks<br/>usePublicForm / useSaveForm / useResponses]
  S[Services<br/>formsService.js]
  SUP[(Supabase<br/>Postgres + RLS)]
  RPC[submit_form_response RPC<br/>server-side validation]
  CACHE[React Query cache]

  UI --> H --> S
  S -->|CRUD + .order()| SUP
  S -->|submitResponse| RPC --> SUP
  SUP -->|data| CACHE --> UI
```

Data flow: **UI → hooks → services → Supabase (RLS) → React Query cache → UI**.
Anonymous submissions are validated inside a Postgres transaction by the RPC,
so the client's rules can't be bypassed.

---

## 🚀 Features

- Dynamic form builder with multiple field types
- Drag-and-drop field reordering
- Live form preview
- Draft and publish workflow
- Full CRUD operations for forms, fields, and responses
- Public form submission
- Secure anonymous access
- Responses dashboard with dynamic field mapping
- Responsive user interface

---

## 🛠 Tech Stack

### Frontend

- React
- JavaScript
- React Router
- TanStack React Query
- Context API

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)
- Server-side validation RPC

---

## ✨ Project Highlights

- Built a dynamic form builder supporting multiple field types with drag-and-drop interactions.
- Designed a scalable database schema using JSON-based field configurations and flexible response storage.
- Implemented full CRUD functionality for forms, fields, and responses using Supabase, with **transaction-safe field saves** (diff-based upsert instead of delete-then-insert).
- Managed client-side state with Context API and React Hook Form; managed server state with TanStack React Query, including caching, synchronization, and background updates.
- Implemented a draft/publish workflow with dirty-state tracking, **stable public links** (re-publish keeps the same `public_id`), and an unpublish action.
- Developed secure public form submission with **Row Level Security** plus a **server-side validation RPC** (`submit_form_response`).

## 🗄️ Database & Security

- Schema, indexes and RLS policies live in [`supabase/migrations`](./supabase/migrations) — see [`supabase/README.md`](./supabase/README.md) for the security model and setup.
- Every table has RLS enabled. Anonymous visitors can only read a published form's minimal columns; owners manage their own forms, fields and responses.

**Applying migrations (in order):**

1. `0001_initial_schema.sql` — tables, indexes, `updated_at` trigger, RLS policies.
2. `0002_validation_rpc.sql` — the `submit_form_response` RPC (server-side validation).
3. `0003_restrict_direct_insert.sql` — drops the direct-insert policy on `responses`.
4. `0004_column_grants.sql` — column-level grants limiting what `anon` can read.
5. `0005_published_snapshot.sql` — adds an (optional) `published_snapshot` column.
6. `0006_drop_is_saved.sql` — drops the unused `forms.is_saved` legacy column.

> After step 3, **the RPC is the only way to submit a response** — direct
> inserts into `responses` are no longer possible, so validation cannot be
> bypassed.
>
> Steps 1–4 are required for the app to work end-to-end. Steps 5–6 are
> optional housekeeping. None of these are auto-applied: run each one in the
> Supabase SQL editor (Dashboard → SQL Editor).

---

## 📦 Installation

> **Requires Node 24** (see `.nvmrc`) and **pnpm**. On Node 20 the Vitest
> test worker crashes due to an `undici@8` incompatibility — use Node 24.

```bash
git clone https://github.com/Ali-jalili/FormFlow.git

cd FormFlow

nvm use            # loads Node 24 from .nvmrc
pnpm install       # install dependencies (frozen lockfile)
pnpm dev           # start the dev server
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 Testing

- Unit + integration tests with **Vitest** and **React Testing Library**.
- Run the full suite: `pnpm test` · watch mode: `pnpm test:watch`.
- Tests cover `sanitizeAnswers` (size/shape guard rails), `isDraftDifferentFromServer`,
  the public-form submission hook (required + invalid-option validation), and a
  mocked end-to-end flow on `PublicFormPage`.
- **CI** (`.github/workflows/ci.yml`) runs lint, build and tests on every
  push/PR to `main` and `develop`.

---

## ⚠️ Known limitations

- **No published snapshot yet.** A published form is answered against its
  *live* fields, so editing the form changes what respondents see immediately.
  Migration `0005_published_snapshot.sql` adds a `published_snapshot jsonb`
  column to enable true freeze-at-publish; the client/RPC aren't wired to it
  yet.
- **`order` column name.** `form_fields.order` uses a SQL reserved word. It
  works (quoted), but renaming to `position` would be cleaner — tracked in
  Future Improvements to avoid a breaking change mid-project.
- **Client-side pagination.** Responses are fetched in full and paged in the
  browser; large forms will need server-side pagination (Supabase `range`).

---

## 🚀 Future Improvements

- Published-form snapshot (freeze at publish) — see `0005_published_snapshot.sql`.
- Rename `form_fields.order` → `position` (reserved-word cleanup).
- Form templates
- Conditional fields and branching logic
- File upload fields
- Email notifications
- Form analytics / per-question charts
- Server-side response pagination
- Excel export (CSV export is already implemented)

---

## 👨‍💻 Author

**Ali Jalili**

- GitHub: https://github.com/Ali-jalili
- LinkedIn: https://linkedin.com/in/ali--jalili
