# Apex Bank — Master Portal

A multi-portal digital banking platform built with React, Vite, TypeScript, and Supabase.

## Project structure

```
master-app/
├── public/                 # Static public assets
├── server.ts               # Express + Vite dev server
├── src/
│   ├── main.tsx            # Application entry point
│   ├── app/
│   │   └── App.tsx         # Routes & portal shell
│   ├── pages/               # (reserved — landing is public/landing.html)
│   ├── features/           # Role-based banking portals
│   │   ├── customer/
│   │   ├── employee/
│   │   ├── admin/
│   │   └── super-admin/
│   ├── components/         # Shared UI (e.g. ProtectedRoute)
│   ├── auth/               # Session & login logic
│   ├── lib/                # Supabase client
│   └── styles/             # Global CSS & animations
├── archive/                # Legacy files (old landing.html, etc.)
└── assets/                 # AI Studio metadata
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Original animated landing (`public/landing.html`) |
| `/customer` | Customer banking portal (login required) |
| `/employee` | Employee operations portal |
| `/admin` | Admin dashboard |
| `/super-admin` | Super admin console |

## Setup

```bash
npm install
cp .env.example .env   # add Supabase + Gemini keys
npm run dev            # http://localhost:3000
```

## Environment variables

```env
VITE_SUPABASE_URL=https://lbkfakhzknokxftxczbm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...   # client-safe publishable key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...     # server only — never expose in the browser
SUPABASE_DB_URL=postgresql://...            # optional — for npm run db:setup
GEMINI_API_KEY=...
```

## Supabase database (one-time setup)

Your Supabase project starts with **no tables**. Create the `students` table and enable **realtime**:

**Option A — SQL Editor (fastest)**  
Open [Supabase SQL Editor](https://supabase.com/dashboard/project/lbkfakhzknokxftxczbm/sql/new), paste the contents of `supabase/schema.sql`, and run it.

**Option B — CLI script**  
Add your database URI to `.env` as `SUPABASE_DB_URL`, then:

```bash
npm run db:setup
```

After setup, customer login uses live data and the customer portal shows a **Live** badge when realtime sync is active.

## Login credentials

See [CREDENTIALS.md](./CREDENTIALS.md) for full details.

| Portal | Email | Password |
|--------|-------|----------|
| Customer | customer@apexbank.com | customer123 |
| Employee | employee@apexbank.com | employee123 |
| Admin | admin@apexbank.com | admin123 |
| Super Admin | superadmin@apexbank.com | superadmin123 |

Customer login also works with any account in the Supabase `students` table (email or mobile + password).
# Apex-Bank
