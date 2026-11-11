# FormFlow

A modern full-stack form builder built with React and Supabase, enabling users to create, publish, and manage dynamic forms with flexible field configurations and response management.

## 🌐 Live Demo

[https://YOUR_FORMFLOW_DEMO_URL](https://form-flow-fawn.vercel.app/)

---

## Features

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
- useReducer

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

---

## ✨ Project Highlights

- Built a dynamic form builder supporting multiple field types with drag-and-drop interactions.
- Designed a scalable database schema using JSON-based field configurations and flexible response storage.
- Implemented full CRUD functionality for forms, fields, and responses using Supabase.
- Managed complex client-side state using Context API and useReducer.
- Managed server state with TanStack React Query, including caching, synchronization, and background updates.
- Implemented a draft/publish workflow with dirty state tracking.
- Developed secure public form submission with backend validation.

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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Apply the Supabase migrations described below, then start the development
server:

```bash
pnpm dev
```

Vite prints the local URL when the server is ready.

## Supabase setup

Run the SQL files in `supabase/migrations/` **in numerical order**, from
`0001_initial_schema.sql` through `0009_required_whitespace_validation.sql`,
using the Supabase Dashboard SQL Editor or your usual migration workflow.

Migrations `0007` and `0008` are required for the current form-save and
response-browsing implementations. Migration `0009` updates server-side
required-answer validation. For an existing database, apply only migrations
that have not already been applied, keeping the same order. After applying a
function migration, refresh the PostgREST schema cache if the new RPC is not
recognized:

```sql
NOTIFY pgrst, 'reload schema';
```

See [`supabase/README.md`](./supabase/README.md) for the migration list,
application details, and database security model.

## Available scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | Start the Vite development server.      |
| `pnpm build`      | Create the production build in `dist/`. |
| `pnpm preview`    | Preview the production build locally.   |
| `pnpm test`       | Run the Vitest suite once.              |
| `pnpm test:watch` | Run Vitest in watch mode.               |
| `pnpm lint`       | Run ESLint.                             |

## Tests and CI

The test suite uses Vitest, jsdom, and React Testing Library. It covers form
builder interactions, public-form validation and submission, response search
and pagination contracts, CSV escaping, form-save behavior, and form utilities.
Database calls are mocked in automated tests; use a configured Supabase project
to verify migrations and live database behavior.

GitHub Actions runs dependency installation, lint, production build, and tests
for pushes and pull requests targeting `main` and `develop`. CI uses Node.js 24
and pnpm 10.

## Project structure

```text
src/
  app/                 Application shell, routes, and protected routes
  components/          Shared layout and UI components
  features/
    Auth/              Supabase authentication context and hook
    form/
      components/      Builder, preview, public form, and dashboard components
      hooks/           Form, response, and submission workflows
      services/        Supabase data access
      utils/           Field constants, builder helpers, and CSV utilities
  lib/                 Supabase client
  pages/               Home, auth, dashboard, builder, public, and response pages
supabase/
  migrations/          PostgreSQL schema, policies, and RPC functions
```

## Current scope and limitations

- **Published forms use live definitions.** The current client does not read or
  write a frozen publish snapshot. Editing and saving a published form changes
  the questions respondents see. Migration `0005` adds a `published_snapshot`
  column as groundwork only; snapshot behavior is not implemented.
- **Response views use current questions.** The response page and CSV export
  map stored answers using the form's current field definitions. Answers for
  questions later removed from a form are not presented as current questions.
- **The response page is paginated, but CSV export fetches every response.**
  Exporting very large forms can take longer and use more browser memory.
- The builder currently supports short text, long text, and multiple choice.
  Conditional logic, file uploads, templates, and per-question analytics are
  outside the current feature set.

## Deployment

The project is configured for Vercel as a single-page application. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment environment,
apply the required Supabase migrations, and deploy the repository. `vercel.json`
rewrites application routes to `index.html` and enables long-lived caching for
hashed assets.

## 👨‍💻 Author

**Ali Jalili** — Frontend Developer

- **Portfolio:** [ali-jalili-dev.vercel.app](https://ali-jalili-dev.vercel.app/)
- **LinkedIn:** [Ali Jalili](https://www.linkedin.com/in/ali--jalili/)
- **Email:** [ali.jalili.dev@gmail.com](mailto:ali.jalili.dev@gmail.com)