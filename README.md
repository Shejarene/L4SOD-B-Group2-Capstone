# L4SOD School Management System

> Capstone Project - Group 2

A comprehensive school management system built with Vue 3, Vite, and Supabase.

## Live Demo

[https://acadex-navy-seven.vercel.app](https://acadex-navy-seven.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue 3 (Composition API) + Vite |
| **State** | Pinia + Vue Router |
| **UI** | Tailwind CSS + PrimeVue |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Hosting** | Vercel |

## Project Structure

```
├── apps/
│   └── web/                    # Vue 3 frontend application
│       ├── public/             # Static assets
│       └── src/
│           ├── assets/         # Global styles (Tailwind)
│           ├── components/     # Reusable UI components
│           ├── layouts/        # Page layouts (MainLayout, Sidebar, Topbar)
│           ├── router/         # Vue Router configuration
│           ├── stores/         # Pinia stores (auth, app)
│           ├── utils/          # Supabase client, API helpers
│           └── views/          # Page components organized by feature
│               ├── auth/       # Login, Signup, Request Access
│               ├── admin/      # Invites, CSV Import
│               ├── dashboard/  # Role-based dashboards
│               ├── students/   # Student management
│               ├── teachers/   # Teacher management
│               ├── classes/    # Classrooms, Levels
│               ├── subjects/   # Subject management
│               ├── marks/      # Marks entry & approval
│               ├── attendance/ # Daily attendance & reports
│               ├── fees/       # Fee structures & payments
│               ├── timetable/  # Class schedules
│               ├── discipline/ # Discipline records
│               ├── communication/ # Messages & announcements
│               ├── lostfound/  # Lost & found reports
│               ├── reports/    # Report cards
│               ├── settings/   # App settings & profile
│               └── help/       # Help & support
├── database/
│   ├── migrations/             # SQL migration files
│   └── seeds/                  # Demo seed data
├── scripts/                    # Utility scripts (seeding, etc.)
├── vercel.json                 # Vercel deployment config
└── package.json                # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Shejarene/L4SOD-B-Group2-Capstone.git
cd L4SOD-B-Group2-Capstone

# Install dependencies
npm install

# Create environment file
cp .env.example apps/web/.env
# Edit apps/web/.env with your Supabase credentials
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Supabase Setup

### 1. Configure Environment Variables

Create `apps/web/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Create Admin User

The app includes a seeding script to create demo admin accounts:

```bash
npm run db:seed -- <YOUR_SERVICE_ROLE_KEY>
```

### 3. Disable Email Confirmation

Go to Supabase Dashboard → Auth → Providers → Email → Turn OFF "Confirm email"

## Default Admin Accounts

| Email | Password | Role |
|---|---|---|
| admin@school.com | admin123 | Super Admin |
| principal@school.com | admin123 | Principal |
| dos@school.com | admin123 | DOS |
| teacher@school.com | admin123 | Teacher |
| accountant@school.com | admin123 | Accountant |
| discipline@school.com | admin123 | Discipline Master |

## Features

- **Role-based Access Control** - 9 distinct user roles with tailored dashboards
- **Access Request System** - Users can request account access, admins review and approve
- **Real-time Notifications** - Super admin gets instant alerts for new access requests
- **Student Management** - Full CRUD with CSV import
- **Teacher Management** - Staff profiles and assignments
- **Marks & Grading** - Entry, approval workflow, report card generation
- **Attendance Tracking** - Daily attendance with reports
- **Fee Management** - Structures, payments, receipts
- **Timetable** - Class scheduling
- **Discipline Records** - Incident tracking
- **Communication** - In-app messaging and announcements
- **Lost & Found** - Report and manage lost items
- **Dark/Light Mode** - Theme toggle
- **Responsive Design** - Works on all devices

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

The `vercel.json` at the root handles the monorepo build configuration automatically.

## License

Private - Capstone Project
