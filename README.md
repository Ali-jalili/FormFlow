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
- Every table has RLS enabled. Anonymous visitors can only read a published form's minimal columns and submit responses through the validated RPC; owners manage their own forms, fields and responses.
- `.env.example` documents the required `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` variables.

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
