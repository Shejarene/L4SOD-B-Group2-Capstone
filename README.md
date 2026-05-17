# L4SOD School Management System

Capstone project - Group 2

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Vite + Pinia + Vue Router + Tailwind CSS + PrimeVue
- **Database**: Supabase (PostgreSQL + Auth + Realtime)

## Project Structure

```
├── apps/
│   └── web/                    # Vue 3 frontend
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── composables/    # Shared composables
│       │   ├── layouts/        # Page layouts (MainLayout, Topbar, Sidebar)
│       │   ├── router/         # Vue Router config
│       │   ├── stores/         # Pinia stores (auth, app)
│       │   ├── utils/          # Supabase client, API helper
│       │   └── views/          # Page components by feature
│       ├── vercel.json         # Vercel deployment config
│       └── package.json
├── database/
│   ├── migrations/             # SQL migrations (run in Supabase)
│   └── seeds/                  # Seed data
├── scripts/                    # Utility scripts
└── package.json                # Root workspace config
```

## Quick Start

### 1. Setup Supabase Database

Go to your Supabase project SQL Editor and run the complete migration:
`database/migrations/001_complete_setup.sql`

This creates all tables, RLS policies, realtime subscriptions, and RPC functions.

### 2. Install & Run

```bash
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### 3. Seed Demo Users

```bash
npm run db:seed -- <YOUR_SUPABASE_SERVICE_ROLE_KEY>
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect to Vercel
3. Vercel auto-detects the `vercel.json` config
4. Set environment variables if needed
5. Deploy!

## Features

- Role-based dashboards (Super Admin, Admin, Principal, DOS, Discipline Master, Accountant, Teacher, Student, Parent)
- Access request system with real-time notifications to Super Admin
- Marks entry, approval workflow, and report generation
- Class and exam timetable management
- Daily attendance tracking
- Fee management and payment recording
- Discipline records
- Lost & found
- In-app messaging and announcements
- Dark/light mode
- Responsive design
