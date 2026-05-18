<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-slate-100">
          {{ greeting }}, {{ authStore.fullName }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening today</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
        <i class="pi pi-calendar text-blue-600 text-xs"></i>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="i in 4" :key="i" class="card h-24">
        <div class="skeleton-warm h-3 w-20 mb-2"></div>
        <div class="skeleton-warm h-6 w-14"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="stat in roleStats" :key="stat.label" class="stat-warm">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="stat.bgClass">
          <i :class="[stat.icon, 'text-base', stat.iconClass]"></i>
        </div>
        <div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
          <p class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="lg:col-span-2 card">
        <h2 class="section-title">Quick Actions</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            v-for="action in roleActions"
            :key="action.label"
            @click="router.push(action.to)"
            class="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 mb-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors">
              <i :class="[action.icon, 'text-xl text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors']"></i>
            </div>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <div class="card">
        <h2 class="section-title">Today</h2>
        <div class="space-y-3">
          <div v-for="item in todayOverview" :key="item.label" class="flex items-center justify-between py-1.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="item.bgClass">
                <i :class="[item.icon, 'text-xs', item.iconClass]"></i>
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ item.label }}</span>
            </div>
            <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="section-title mb-0">Recent Students</h2>
          <router-link to="/app/students" class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div v-if="recentStudents.length" class="space-y-2">
          <div v-for="student in recentStudents" :key="student.id" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400">
              {{ getInitials(student) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ getStudentName(student) }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ student.class?.name || student.className || 'No class' }}</p>
            </div>
            <span class="badge-warm" :class="student.status === 'active' ? 'badge-success' : 'badge-danger'">
              <span class="w-1.5 h-1.5 rounded-full" :class="student.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
              {{ student.status || 'active' }}
            </span>
          </div>
        </div>
        <div v-else class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto">
            <i class="pi pi-users text-xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">No Students Found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Get started by adding your first student to the system.
          </p>
          <router-link
            to="/app/students"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Your First Student
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="section-title mb-0">Announcements</h2>
          <router-link to="/app/communication/announcements" class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto">
            <i class="pi pi-bullhorn text-xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">Welcome to Acadex!</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            This is where you'll see important school-wide announcements.
          </p>
          <router-link
            to="/app/communication/announcements"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            Make your first announcement
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../utils/supabase'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalUsers: 0,
  todayAttendance: 0,
  pendingFees: 0,
})
const recentStudents = ref([])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const roleStats = computed(() => {
  const base = [
    { label: 'Students', value: stats.value.totalStudents, icon: 'pi pi-users', bgClass: 'bg-blue-100 dark:bg-blue-900/50', iconClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'Teachers', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-emerald-100 dark:bg-emerald-900/50', iconClass: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Classes', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-violet-100 dark:bg-violet-900/50', iconClass: 'text-violet-600 dark:text-violet-400' },
  ]

  if (authStore.isAdmin || authStore.userRole === 'accountant') {
    base.push({ label: 'Pending Fees', value: stats.value.pendingFees, icon: 'pi pi-dollar', bgClass: 'bg-amber-100 dark:bg-amber-900/50', iconClass: 'text-amber-600 dark:text-amber-400' })
  } else {
    base.push({ label: 'Active Users', value: stats.value.totalUsers, icon: 'pi pi-users', bgClass: 'bg-amber-100 dark:bg-amber-900/50', iconClass: 'text-amber-600 dark:text-amber-400' })
  }

  return base
})

const roleActions = computed(() => {
  const role = authStore.userRole
  const actions = []

  if (['super_admin', 'admin', 'principal', 'dos', 'teacher'].includes(role)) {
    actions.push({ label: 'Add Student', icon: 'pi pi-user-plus', to: '/app/students' })
  }
  if (['teacher', 'dos', 'admin'].includes(role)) {
    actions.push({ label: 'Enter Marks', icon: 'pi pi-chart-line', to: '/app/marks' })
    actions.push({ label: 'Attendance', icon: 'pi pi-calendar', to: '/app/attendance' })
  }
  if (['accountant', 'admin', 'super_admin'].includes(role)) {
    actions.push({ label: 'Record Payment', icon: 'pi pi-credit-card', to: '/app/fees/payments' })
  }
  if (['super_admin', 'admin', 'principal', 'dos', 'teacher'].includes(role)) {
    actions.push({ label: 'Create Exam', icon: 'pi pi-file-edit', to: '/app/exams' })
  }
  actions.push({ label: 'Lost & Found', icon: 'pi pi-search', to: '/app/lost-found' })
  if (['super_admin', 'admin'].includes(role)) {
    actions.push({ label: 'Send Message', icon: 'pi pi-send', to: '/app/communication' })
  }

  return actions.slice(0, 6)
})

const todayOverview = computed(() => {
  const rate = stats.value.totalStudents > 0 ? Math.round((stats.value.todayAttendance / stats.value.totalStudents) * 100) : 0
  return [
    { label: 'Attendance', value: `${rate}%`, icon: 'pi pi-check-circle', bgClass: 'bg-emerald-100 dark:bg-emerald-900/50', iconClass: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Classes', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-blue-100 dark:bg-blue-900/50', iconClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'Teachers', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-violet-100 dark:bg-violet-900/50', iconClass: 'text-violet-600 dark:text-violet-400' },
  ]
})

const getInitials = (student) => {
  const name = getStudentName(student)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStudentName = (student) => {
  const user = student.user || student.Users
  if (user) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
  }
  return student.name || student.admissionNumber || 'Unknown'
}

const loadStats = async () => {
  loading.value = true
  try {
    const [
      { count: studentCount },
      { count: teacherCount },
      { count: classCount },
      { count: userCount },
    ] = await Promise.all([
      supabase.from('Students').select('*', { count: 'exact', head: true }),
      supabase.from('Teachers').select('*', { count: 'exact', head: true }),
      supabase.from('Classes').select('*', { count: 'exact', head: true }),
      supabase.from('Users').select('*', { count: 'exact', head: true }),
    ])

    stats.value = {
      totalStudents: studentCount || 0,
      totalTeachers: teacherCount || 0,
      totalClasses: classCount || 0,
      totalUsers: userCount || 0,
      todayAttendance: 0,
      pendingFees: 0,
    }

    const { data: students } = await supabase
      .from('Students')
      .select('*, class:Classes(name), user:Users(firstName, lastName)')
      .order('createdAt', { ascending: false })
      .limit(5)
    recentStudents.value = students || []
  } catch (e) {
    console.error('Failed to load dashboard:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>
