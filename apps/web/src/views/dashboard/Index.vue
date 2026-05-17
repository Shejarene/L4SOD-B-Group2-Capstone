<template>
  <div>
    <!-- Welcome header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#2d2a26] dark:text-[#f5f0ea]">
          {{ greeting }}, {{ authStore.fullName }}
        </h1>
        <p class="text-[#8a857d] mt-1">Here's what's happening today</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-[#8a857d] bg-white dark:bg-[#242220] px-4 py-2 rounded-2xl border border-[#e8e4de] dark:border-[#3a3632]">
        <i class="pi pi-calendar text-[#e07a5f]"></i>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div v-for="i in 4" :key="i" class="card h-28">
        <div class="skeleton-warm h-4 w-24 mb-3"></div>
        <div class="skeleton-warm h-8 w-16"></div>
      </div>
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div v-for="stat in roleStats" :key="stat.label" class="stat-warm">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" :class="stat.bgClass">
          <i :class="[stat.icon, 'text-xl', stat.iconClass]"></i>
        </div>
        <div>
          <p class="text-sm text-[#8a857d]">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-[#2d2a26] dark:text-[#f5f0ea]">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Main content grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Quick Actions -->
      <div class="lg:col-span-2 card">
        <h2 class="section-title">Quick Actions</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            v-for="action in roleActions"
            :key="action.label"
            @click="router.push(action.to)"
            class="action-warm group"
          >
            <div class="action-warm-icon group-hover:bg-[#e07a5f]/15">
              <i :class="action.icon" class="text-xl text-[#6b6560] group-hover:text-[#e07a5f] transition-colors duration-200"></i>
            </div>
            <span class="text-sm font-semibold text-[#2d2a26] dark:text-[#f5f0ea] text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Today's Overview -->
      <div class="card">
        <h2 class="section-title">Today</h2>
        <div class="space-y-4">
          <div v-for="item in todayOverview" :key="item.label" class="flex items-center justify-between py-2">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="item.bgClass">
                <i :class="[item.icon, 'text-sm', item.iconClass]"></i>
              </div>
              <span class="text-sm text-[#6b6560] dark:text-[#8a857d]">{{ item.label }}</span>
            </div>
            <span class="text-sm font-bold text-[#2d2a26] dark:text-[#f5f0ea]">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Students -->
      <div class="card">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-title mb-0">Recent Students</h2>
          <router-link to="/app/students" class="text-sm text-[#e07a5f] font-semibold hover:underline">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div v-if="recentStudents.length" class="space-y-3">
          <div v-for="student in recentStudents" :key="student.id" class="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#faf8f5] dark:hover:bg-[#2a2826] transition-colors">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e07a5f]/20 to-[#f2cc8f]/20 flex items-center justify-center text-sm font-bold text-[#e07a5f]">
              {{ getInitials(student) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[#2d2a26] dark:text-[#f5f0ea] truncate">{{ getStudentName(student) }}</p>
              <p class="text-xs text-[#8a857d]">{{ student.class?.name || student.className || 'No class' }}</p>
            </div>
            <span class="badge-warm" :class="student.status === 'active' ? 'badge-success' : 'badge-danger'">
              <span class="w-1.5 h-1.5 rounded-full" :class="student.status === 'active' ? 'bg-[#81b29a]' : 'bg-[#e07a5f]'"></span>
              {{ student.status || 'active' }}
            </span>
          </div>
        </div>
        <div v-else class="empty-warm py-10">
          <div class="empty-warm-icon">
            <i class="pi pi-users text-2xl text-[#b5b0a8]"></i>
          </div>
          <p class="text-[#8a857d]">No students yet</p>
          <router-link to="/app/students" class="text-sm text-[#e07a5f] font-semibold mt-2 inline-block hover:underline">
            Add your first student
          </router-link>
        </div>
      </div>

      <!-- Announcements -->
      <div class="card">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-title mb-0">Announcements</h2>
          <router-link to="/app/communication/announcements" class="text-sm text-[#e07a5f] font-semibold hover:underline">
            View all <i class="pi pi-arrow-right text-xs ml-1"></i>
          </router-link>
        </div>
        <div class="empty-warm py-10">
          <div class="empty-warm-icon">
            <i class="pi pi-bullhorn text-2xl text-[#b5b0a8]"></i>
          </div>
          <p class="text-[#8a857d]">No announcements yet</p>
          <router-link to="/app/communication/announcements" class="text-sm text-[#e07a5f] font-semibold mt-2 inline-block hover:underline">
            Create one
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
    { label: 'Students', value: stats.value.totalStudents, icon: 'pi pi-users', bgClass: 'bg-[#e07a5f]/10 dark:bg-[#e07a5f]/15', iconClass: 'text-[#e07a5f]' },
    { label: 'Teachers', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-[#81b29a]/10 dark:bg-[#81b29a]/15', iconClass: 'text-[#81b29a]' },
    { label: 'Classes', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-[#3d405b]/10 dark:bg-[#3d405b]/15', iconClass: 'text-[#3d405b] dark:text-[#f2cc8f]' },
  ]

  if (authStore.isAdmin || authStore.userRole === 'accountant') {
    base.push({ label: 'Pending Fees', value: stats.value.pendingFees, icon: 'pi pi-dollar', bgClass: 'bg-[#f2cc8f]/20', iconClass: 'text-[#b8860b]' })
  } else {
    base.push({ label: 'Active Users', value: stats.value.totalUsers, icon: 'pi pi-users', bgClass: 'bg-[#f2cc8f]/20', iconClass: 'text-[#b8860b]' })
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
    { label: 'Attendance', value: `${rate}%`, icon: 'pi pi-check-circle', bgClass: 'bg-[#81b29a]/10', iconClass: 'text-[#81b29a]' },
    { label: 'Classes', value: stats.value.totalClasses, icon: 'pi pi-building', bgClass: 'bg-[#3d405b]/10 dark:bg-[#3d405b]/15', iconClass: 'text-[#3d405b] dark:text-[#f2cc8f]' },
    { label: 'Teachers', value: stats.value.totalTeachers, icon: 'pi pi-user-plus', bgClass: 'bg-[#e07a5f]/10', iconClass: 'text-[#e07a5f]' },
  ]
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
    console.error('Failed to load dashboard:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>
