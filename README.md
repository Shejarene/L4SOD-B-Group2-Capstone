# Acadex

Acadex is a comprehensive, production-ready school management platform with Vue 3 frontend and Node.js/Express backend.

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Vite + Pinia + Vue Router + Tailwind CSS + PrimeVue
- **Backend**: Node.js + Express.js + PostgreSQL (via Sequelize ORM) + JWT Authentication
- **Optional**: Docker Compose for easy deployment

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

### Using Docker (Recommended)

```bash
docker-compose up -d
```

This starts PostgreSQL, the backend API (port 5000), and the frontend (port 5173).

### Manual Setup

#### Prerequisites

- Node.js 20+
- PostgreSQL 16+

#### Backend Setup

```bash
cd backend
npm install
cp .env .env.local  # Edit as needed
npm run migrate
npm run seed
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 and the API at http://localhost:5000.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@school.com | admin123 |
| Principal | principal@school.com | admin123 |
| Director of Studies | dos@school.com | admin123 |
| Teacher | teacher@school.com | admin123 |
| Accountant | accountant@school.com | admin123 |
| Discipline Master | discipline@school.com | admin123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get profile

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `POST /api/users/student` - Create student account
- `POST /api/users/teacher` - Create teacher account
- `POST /api/users/parent` - Create parent account

### Students, Teachers, Classes, Subjects, Exams
- Full CRUD endpoints under `/api/students`, `/api/teachers`, `/api/classes`, `/api/subjects`, `/api/exams`

### Marks
- `GET /api/marks` - List marks
- `POST /api/marks` - Enter mark
- `POST /api/marks/batch` - Batch enter marks
- `POST /api/marks/submit` - Submit for approval
- `POST /api/marks/approve` - Approve marks
- `POST /api/marks/reject` - Reject marks

### Attendance, Fees, Timetable, Discipline, Communication
- Full endpoints under respective routes

## Project Structure

```
backend/
  src/
    config/     - Configuration files
    models/     - Sequelize models
    controllers/ - Route handlers
    services/   - Business logic
    middleware/  - Auth, validation, error handling
    routes/     - Express routes
    utils/      - Helpers

frontend/
  src/
    components/ - Reusable components
    views/      - Page components per module
    layouts/    - Main layout, sidebar, topbar
    stores/     - Pinia stores
    router/     - Vue Router configuration
    composables/- Shared composables
    utils/      - Axios instance, helpers
```

## Deploy to Vercel

1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Vercel auto-detects Vite framework
4. Deploy!
