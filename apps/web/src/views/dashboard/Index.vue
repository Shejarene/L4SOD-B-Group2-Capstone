<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Good {{ timeOfDay }}, {{ authStore.fullName }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening at your school today</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <i class="pi pi-calendar"></i>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="i in 4" :key="i" class="card h-28">
        <div class="skeleton h-4 w-24 mb-3"></div>
        <div class="skeleton h-8 w-16"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in roleStats" :key="stat.label" class="stat-card">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="stat.bgClass">
          <i :class="[stat.icon, 'text-xl', stat.iconClass]"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="action in roleActions"
            :key="action.label"
            @click="router.push(action.to)"
            class="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
          >
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <i :class="action.icon" class="text-xl text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"></i>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Today's Overview</h2>
        <div class="space-y-4">
          <div v-for="item in todayOverview" :key="item.label" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="item.bgClass">
                <i :class="[item.icon, 'text-sm', item.iconClass]"></i>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Students</h2>
          <router-link to="/app/students" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div v-if="recentStudents.length" class="space-y-3">
          <div v-for="student in recentStudents" :key="student.id" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-400">
              {{ getInitials(student) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ getStudentName(student) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ student.class?.name || student.className || 'No class' }}</p>
            </div>
            <span class="badge" :class="student.status === 'active' ? 'badge-success' : 'badge-danger'">
              {{ student.status || 'active' }}
            </span>
          </div>
        </div>
        <div v-else class="empty-state py-8">
          <div class="empty-state-icon">
            <i class="pi pi-users text-2xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 dark:text-gray-400">No students yet</p>
          <router-link to="/app/students" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-2 inline-block">
            Add your first student
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Announcements</h2>
          <router-link to="/app/communication/announcements" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div class="empty-state py-8">
          <div class="empty-state-icon">
            <i class="pi pi-bullhorn text-2xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 dark:text-gray-400">No announcements yet</p>
          <router-link to="/app/communication/announcements" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium mt-2 inline-block">
            Create an announcement
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
import api from '../../utils/api'
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

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
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
    { label: 'Total Students', value: stats.value.totalStudents, icon: 'pi pi-users', bgClass: 'bg-blue-100 dark:bg-blue-900/50', iconClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'Total Teachers', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-green-100 dark:bg-green-900/50', iconClass: 'text-green-600 dark:text-green-400' },
    { label: 'Total Classes', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-purple-100 dark:bg-purple-900/50', iconClass: 'text-purple-600 dark:text-purple-400' },
  ]

  if (authStore.isAdmin || authStore.userRole === 'accountant') {
    base.push({ label: 'Pending Fees', value: stats.value.pendingFees, icon: 'pi pi-dollar', bgClass: 'bg-orange-100 dark:bg-orange-900/50', iconClass: 'text-orange-600 dark:text-orange-400' })
  } else if (authStore.isTeacher) {
    base.push({ label: 'Today\'s Classes', value: stats.value.totalClasses, icon: 'pi pi-clock', bgClass: 'bg-orange-100 dark:bg-orange-900/50', iconClass: 'text-orange-600 dark:text-orange-400' })
  } else {
    base.push({ label: 'Active Users', value: stats.value.totalUsers, icon: 'pi pi-users', bgClass: 'bg-orange-100 dark:bg-orange-900/50', iconClass: 'text-orange-600 dark:text-orange-400' })
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
    actions.push({ label: 'Take Attendance', icon: 'pi pi-calendar', to: '/app/attendance' })
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
  const items = [
    { label: 'Attendance Rate', value: `${stats.value.totalStudents > 0 ? Math.round((stats.value.todayAttendance / stats.value.totalStudents) * 100) : 0}%`, icon: 'pi pi-check-circle', bgClass: 'bg-green-100 dark:bg-green-900/50', iconClass: 'text-green-600 dark:text-green-400' },
    { label: 'Classes Today', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-blue-100 dark:bg-blue-900/50', iconClass: 'text-blue-600 dark:text-blue-400' },
    { label: 'Teachers Present', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-purple-100 dark:bg-purple-900/50', iconClass: 'text-purple-600 dark:text-purple-400' },
  ]
  return items
})

const getInitials = (student) => {
  const name = getStudentName(student)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStudentName = (student) => {
  if (student.user) return `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim()
  if (student.Users) return `${student.Users.firstName || ''} ${student.Users.lastName || ''}`.trim()
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
    console.error('Failed to load dashboard stats:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>
