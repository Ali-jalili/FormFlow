# FormFlow

A modern full-stack form builder built with React and Supabase, enabling users to create, publish, and manage dynamic forms with flexible field configurations and response management.

## 🌐 Live Demo

[View Live Demo](https://form-flow-phi.vercel.app/)

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
- React Hook Form

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
- Managed complex client-side state using Context API.
- Managed server state with TanStack React Query, including caching, synchronization, and background updates.
- Implemented a draft/publish workflow with dirty state tracking.
- Developed secure public form submission with backend validation.

---

## 📦 Installation

```bash
git clone https://github.com/Ali-jalili/FormFlow.git

cd FormFlow

pnpm install
pnpm dev
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
