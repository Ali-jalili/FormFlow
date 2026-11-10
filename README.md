# FormFlow

A modern full-stack form builder built with React and Supabase, enabling users to create, publish, and manage dynamic forms with flexible field configurations and response management.

## 🌐 Live Demo

[https://YOUR_FORMFLOW_DEMO_URL](https://form-flow-fawn.vercel.app/)

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

> After step 3, **the RPC is the only way to submit a response** — direct
> inserts into `responses` are no longer possible, so validation cannot be
> bypassed. These files are not auto-applied; run each one in the Supabase
> SQL editor (Dashboard → SQL Editor).

---

## 📦 Installation

```bash
git clone https://github.com/Ali-jalili/FormFlow.git

cd FormFlow

npm install

npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Future Improvements

- Form templates
- Conditional fields and branching logic
- File upload fields
- Email notifications
- Form analytics
- Export responses (CSV / Excel)
- Unit and integration testing

---

## 👨‍💻 Author

**Ali Jalili**

- GitHub: https://github.com/Ali-jalili
- LinkedIn: https://linkedin.com/in/ali--jalili
