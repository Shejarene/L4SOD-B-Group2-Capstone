# School Management System

A comprehensive, production-ready school management system with Vue 3 frontend.

## Tech Stack

**Frontend**: Vue 3 (Composition API) + Vite + Pinia + Vue Router + Tailwind CSS + PrimeVue

## Features

- Role-based dashboards (Super Admin, Admin, Principal, DOS, Discipline Master, Accountant, Teacher, Student, Parent)
- Marks entry, approval workflow, and report generation
- Class and exam timetable management with conflict detection
- Daily attendance tracking with reports
- Fee structure configuration, invoice generation, and payment recording
- Discipline records management
- In-app messaging and announcements
- Dark/light mode
- Responsive design (mobile-first)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@school.com | admin123 |
| Principal | principal@school.com | admin123 |
| Director of Studies | dos@school.com | admin123 |
| Teacher | teacher@school.com | admin123 |
| Accountant | accountant@school.com | admin123 |
| Discipline Master | discipline@school.com | admin123 |

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # CSS, images, fonts
│   ├── components/      # Reusable UI components
│   ├── composables/     # Shared composables
│   ├── layouts/         # Page layouts
│   ├── router/          # Vue Router config
│   ├── stores/          # Pinia stores
│   ├── utils/           # Axios instance, helpers
│   ├── views/           # Routed page components
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json          # Vercel deployment config
```

## Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Vercel auto-detects Vite framework
4. Deploy!
