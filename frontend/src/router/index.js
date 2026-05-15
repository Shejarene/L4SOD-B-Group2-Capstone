import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/signup/:token',
    name: 'Signup',
    component: () => import('../views/auth/Signup.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/request-login',
    name: 'RequestLogin',
    component: () => import('../views/auth/RequestLogin.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/app',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Index.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'students',
        name: 'Students',
        component: () => import('../views/students/List.vue'),
        meta: { title: 'Students', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      },
      {
        path: 'students/:id',
        name: 'StudentDetail',
        component: () => import('../views/students/Detail.vue'),
        meta: { title: 'Student Profile' },
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('../views/teachers/List.vue'),
        meta: { title: 'Teachers', roles: ['super_admin', 'admin', 'principal', 'dos'] },
      },
      {
        path: 'teachers/:id',
        name: 'TeacherDetail',
        component: () => import('../views/teachers/Detail.vue'),
        meta: { title: 'Teacher Profile' },
      },
      {
        path: 'classes',
        name: 'LevelsTrades',
        component: () => import('../views/classes/LevelsView.vue'),
        meta: { title: 'Levels & Trades', roles: ['super_admin', 'admin', 'dos'] },
      },
      {
        path: 'classrooms',
        name: 'Classrooms',
        component: () => import('../views/classes/Classrooms.vue'),
        meta: { title: 'Classrooms', roles: ['*'] },
      },
      {
        path: 'subjects',
        name: 'Subjects',
        component: () => import('../views/subjects/List.vue'),
        meta: { title: 'Subjects', roles: ['super_admin', 'admin', 'principal', 'dos'] },
      },
      {
        path: 'marks',
        name: 'Marks',
        component: () => import('../views/marks/Index.vue'),
        meta: { title: 'Marks Entry', roles: ['teacher', 'dos', 'admin'] },
      },
      {
        path: 'marks/approval',
        name: 'MarksApproval',
        component: () => import('../views/marks/Approval.vue'),
        meta: { title: 'Marks Approval', roles: ['dos', 'admin', 'principal'] },
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('../views/attendance/Index.vue'),
        meta: { title: 'Attendance', roles: ['teacher', 'admin', 'principal'] },
      },
      {
        path: 'attendance/report',
        name: 'AttendanceReport',
        component: () => import('../views/attendance/Report.vue'),
        meta: { title: 'Attendance Report' },
      },
      {
        path: 'fees',
        name: 'Fees',
        component: () => import('../views/fees/Index.vue'),
        meta: { title: 'Fee Management', roles: ['accountant', 'admin', 'super_admin'] },
      },
      {
        path: 'fees/structures',
        name: 'FeeStructures',
        component: () => import('../views/fees/Structures.vue'),
        meta: { title: 'Fee Structures', roles: ['accountant', 'admin', 'super_admin'] },
      },
      {
        path: 'fees/payments',
        name: 'Payments',
        component: () => import('../views/fees/Payments.vue'),
        meta: { title: 'Payments', roles: ['accountant', 'admin', 'super_admin'] },
      },
      {
        path: 'timetable',
        name: 'Timetable',
        component: () => import('../views/timetable/Index.vue'),
        meta: { title: 'Timetable' },
      },
      {
        path: 'discipline',
        name: 'Discipline',
        component: () => import('../views/discipline/Index.vue'),
        meta: { title: 'Discipline', roles: ['discipline_master', 'admin', 'principal'] },
      },
      {
        path: 'communication',
        name: 'Communication',
        component: () => import('../views/communication/Index.vue'),
        meta: { title: 'Communication' },
      },
      {
        path: 'communication/announcements',
        name: 'Announcements',
        component: () => import('../views/communication/Announcements.vue'),
        meta: { title: 'Announcements' },
      },
      {
        path: 'lost-found',
        name: 'LostFound',
        component: () => import('../views/lostfound/Index.vue'),
        meta: { title: 'Lost & Found' },
      },
      {
        path: 'lost-found/admin',
        name: 'LostFoundAdmin',
        component: () => import('../views/lostfound/AdminReview.vue'),
        meta: { title: 'Lost & Found Admin', roles: ['super_admin', 'admin'] },
      },
      {
        path: 'invites',
        name: 'Invites',
        component: () => import('../views/admin/Invites.vue'),
        meta: { title: 'Invite Management', roles: ['super_admin'] },
      },
      {
        path: 'import',
        name: 'CsvImport',
        component: () => import('../views/admin/CsvImport.vue'),
        meta: { title: 'Import Students', roles: ['super_admin', 'admin'] },
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/help/Index.vue'),
        meta: { title: 'Help & Support' },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/reports/Index.vue'),
        meta: { title: 'Reports', roles: ['super_admin', 'admin', 'principal', 'dos'] },
      },
      {
        path: 'reports/report-card',
        name: 'ReportCard',
        component: () => import('../views/reports/ReportCard.vue'),
        meta: { title: 'Report Card', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/settings/Index.vue'),
        meta: { title: 'Settings', roles: ['super_admin', 'admin'] },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/settings/Profile.vue'),
        meta: { title: 'My Profile' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/app/dashboard')
  } else if (to.path === '/' && authStore.isAuthenticated) {
    next('/app/dashboard')
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    next('/app/dashboard')
  } else {
    next()
  }
})

export default router
