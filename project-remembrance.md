# School Management System - Project Remembrance

## Vision
A production-ready school management platform serving K-12 institutions with role-based access for 9 user roles.

## Tech Stack
- **Frontend**: Vue 3 (Composition API) + Vite + Pinia + Vue Router + Tailwind CSS + PrimeVue
- **Backend**: Node.js + Express.js + PostgreSQL (via Sequelize ORM) + JWT Authentication
- **Deploy**: Docker Compose (PostgreSQL + backend + frontend w/ nginx)

## How to Run
```bash
# Terminal 1 (PostgreSQL):
sudo docker start school-pg

# Terminal 2 (Backend - port 5000):
cd "/home/henry/project stage/backend" && npm run dev

# Terminal 3 (Frontend - port 5173):
cd "/home/henry/project stage/frontend" && npm run dev
```

## All Features Implemented

### Core
- [x] JWT auth with refresh tokens (1h access, 7d refresh)
- [x] Role-based access on every route and sidebar
- [x] Dark/light mode (Tailwind class + PrimeVue dynamic theme)
- [x] Responsive sidebar (pushes content, collapsible)
- [x] Footer with links and version
- [x] Breadcrumb navigation
- [x] Toast notifications & confirmation dialogs
- [x] Loading spinners & skeletons
- [x] CSV/Excel export on data tables

### Welcome Page (Landing)
- [x] Hero section with school branding and CTA
- [x] Features section with 9 feature cards
- [x] Call-to-action section
- [x] Footer with contact info and links
- [x] Dark mode toggle available before login

### Authentication
- [x] Login page with professional two-column layout
- [x] One-click demo account fill buttons (Super Admin, Principal, DOS, Teacher)
- [x] Password show/hide toggle
- [x] Input validation with animated error messages
- [x] Auto-redirect authenticated users to dashboard
- [x] JWT auto-refresh on 401

### Invite System (Super Admin Only)
- [x] Generate invite links for: Teacher, Student, Parent, Accountant, Discipline Master, DOS
- [x] Optional target email per invite
- [x] 7-day expiration on invites
- [x] Invite verification endpoint (used by signup page)
- [x] Accept invite with account creation (auto-creates Student/Teacher/Parent profiles)
- [x] Invite management page with stats (sent, accepted, pending)
- [x] One-click copy invite URL
- [x] Invite links expire after use

### Dashboards
- [x] Role-specific dashboards (Admin/Teacher/Student/Parent)
- [x] Statistics cards (students, teachers, classes, users)
- [x] Quick actions grid
- [x] Recent activity placeholder

### Students Module
- [x] CRUD with pagination and search
- [x] Import via invite link
- [x] Profile view with personal info, class/section
- [x] Parent linking
- [x] Performance and marks view
- [x] Status badges (active, graduated, suspended, etc.)

### Teachers Module
- [x] CRUD with pagination
- [x] Import via invite link
- [x] Profile with department, qualifications, salary
- [x] Subject allocations display
- [x] Employment status tracking

### Classes & Sections
- [x] Class management with expandable sections
- [x] Student count per class
- [x] Section management (A, B, C, etc.)

### Subjects & Allocations
- [x] Subject CRUD per class
- [x] Department association
- [x] Subject allocation to teachers
- [x] Coefficient and type (core/elective/practical)

### Marks Module
- [x] Spreadsheet-like entry interface
- [x] Student scores with auto-grade calculation
- [x] Batch save all marks at once
- [x] Marks approval workflow:
  - Teacher enters (draft) → submits (submitted) → DOS/Admin approves (approved) or rejects (rejected)
- [x] Submitted marks filtered for approval
- [x] Bulk approve/reject with selection
- [x] Grade severity coloring (A=green, B=blue, D=yellow, F=red)

### Attendance Module
- [x] Daily class attendance (Present/Absent/Late/Excused)
- [x] One-click status selection per student
- [x] Optional remark per entry
- [x] Attendance report with date range filtering
- [x] Status badges with color coding

### Fee Management
- [x] Fee structure configuration per class
- [x] Fee types: tuition, transport, boarding, library, sports, other
- [x] Frequency: termly, yearly, one-time
- [x] Invoice generation per student
- [x] Payment recording (cash, bank transfer, mobile money, cheque, online)
- [x] Receipt number generation
- [x] Invoice status tracking (pending, partial, paid, overdue)
- [x] Balance calculation on payments

### Timetable
- [x] View timetable by class and day
- [x] Day-of-week names mapping
- [x] Subject, teacher, room, time display
- [x] Conflict detection (teacher, room, section)

### Discipline Module
- [x] Positive and negative records
- [x] Incident tracking with actions (warning, suspension, expulsion, commendation)
- [x] Status workflow (open → resolved → closed)
- [x] Case management

### Lost & Found Module
- [x] Students report missing items (name, description, category, location, date)
- [x] Categories: electronics, clothing, books, stationery, money, jewelry, documents, other
- [x] Super Admin approves/rejects with remark before public visibility
- [x] Browse approved items with category filter
- [x] My Reports tab for user's own submissions
- [x] Admin review dashboard with stats (pending/approved/rejected/resolved)
- [x] Rejection reason required
- [x] Detail dialog on item click
- [x] Pagination on browse view

### Communication Module
- [x] In-app messaging between any users
- [x] Role-based recipient selection
- [x] Unread message count
- [x] Announcements with priority levels (low, normal, high, urgent)
- [x] Role-targeted announcements
- [x] Subject and body in messages

### Reports Dashboard
- [x] Quick links to: Performance, Attendance, Fee Collection, Grade Summary, Discipline, Lost & Found

### Help & Support Page
- [x] FAQ accordion (6 questions covering common tasks)
- [x] Quick guide cards
- [x] Contact Super Admin section (email, phone, in-app chat)
- [x] System info card (version, role, account status)

### Settings
- [x] School info configuration (name, address, academic year)
- [x] Auto-loads current settings
- [x] System info display

### Profile
- [x] User info display
- [x] Role badge
- [x] Account details (name, email, phone, last login)

### Infrastructure
- [x] Docker compose (PostgreSQL + backend + frontend)
- [x] Dockerfiles for backend (Node 20) and frontend (nginx)
- [x] nginx config with SPA routing + API proxy
- [x] .gitignore
- [x] Demo seed data (6 users, 6 classes, sections, departments, settings)
- [x] README with setup instructions and API docs

## Database Tables (19 + 2 new)
Users, Roles, Students, Teachers, Parents, Classes, Sections, Departments, Subjects, SubjectAllocations, Exams, Marks, Attendance, FeeStructures, Invoices, FeePayments, DisciplinaryRecords, Timetables, Messages, Announcements, LeaveRequests, AuditLogs, Settings, **Invites**, **LostItems**

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@school.com | admin123 |
| Principal | principal@school.com | admin123 |
| DOS | dos@school.com | admin123 |
| Teacher | teacher@school.com | admin123 |
| Accountant | accountant@school.com | admin123 |
| Discipline Master | discipline@school.com | admin123 |

## Key URLs
- Welcome/Landing: http://localhost:5173/
- Login: http://localhost:5173/login
- Signup (via invite): http://localhost:5173/signup/{token}
- Dashboard: http://localhost:5173/app/dashboard
- Help: http://localhost:5173/app/help
- Lost & Found: http://localhost:5173/app/lost-found
- API: http://localhost:5000/api/
- Health: http://localhost:5000/api/health

## Recently Added Features
- [x] Report card PDF generation (frontend jspdf + backend pdfkit)
- [x] Bulk student CSV import with validation
- [x] Email integration (SMTP configuration + report card emailing)

## Future Ideas
- Real-time notifications (Socket.io)
- Online payment gateway
- Mobile app (Vue Native / Flutter)
- AI-powered performance predictions
- Multi-language support (i18n)
- Drag-drop timetable builder
- Two-factor authentication
- Biometric attendance
- Library management module
- Transport tracking module
- Hostel management module
