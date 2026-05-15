<template>
  <div>
    <h1 class="page-title">Welcome, {{ authStore.fullName }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard label="Total Students" :value="stats.totalStudents" icon="pi-users" bgClass="bg-blue-100 dark:bg-blue-900" iconClass="text-blue-600 dark:text-blue-300" />
      <StatCard label="Total Teachers" :value="stats.totalTeachers" icon="pi-user-plus" bgClass="bg-green-100 dark:bg-green-900" iconClass="text-green-600 dark:text-green-300" />
      <StatCard label="Total Classes" :value="stats.totalClasses" icon="pi-building" bgClass="bg-purple-100 dark:bg-purple-900" iconClass="text-purple-600 dark:text-purple-300" />
      <StatCard label="Active Users" :value="stats.totalUsers" icon="pi-users" bgClass="bg-orange-100 dark:bg-orange-900" iconClass="text-orange-600 dark:text-orange-300" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3">
          <Button v-for="action in quickActions" :key="action.label" :label="action.label" :icon="action.icon" class="p-button-outlined justify-start" @click="router.push(action.to)" />
        </div>
      </div>
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div v-if="activities.length" class="space-y-4">
          <div v-for="log in activities" :key="log.id" class="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <i :class="getActivityIcon(log.action)" class="text-blue-600 dark:text-blue-300 text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                <span class="font-semibold">{{ log.user?.firstName }} {{ log.user?.lastName }}</span>
                {{ getActivityText(log.action, log.entity) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(log.createdAt) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <i class="pi pi-clock text-4xl mb-3"></i>
          <p>No recent activity found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'
import StatCard from '../../components/StatCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const stats = ref({
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalUsers: 0,
})
const activities = ref([])

const quickActions = [
  { label: 'Add Student', icon: 'pi pi-user-plus', to: '/app/students' },
  { label: 'Enter Marks', icon: 'pi pi-chart-line', to: '/app/marks' },
  { label: 'Take Attendance', icon: 'pi pi-calendar', to: '/app/attendance' },
  { label: 'Record Payment', icon: 'pi pi-dollar', to: '/app/fees/payments' },
  { label: 'Lost & Found', icon: 'pi pi-search', to: '/app/lost-found' },
]

const getActivityIcon = (action) => {
  if (action.includes('CREATE')) return 'pi pi-plus-circle'
  if (action.includes('UPDATE')) return 'pi pi-pencil'
  if (action.includes('DELETE')) return 'pi pi-trash'
  if (action === 'LOGIN') return 'pi pi-sign-in'
  if (action === 'LOGOUT') return 'pi pi-sign-out'
  return 'pi pi-info-circle'
}

const getActivityText = (action, entity) => {
  const entityName = entity.toLowerCase()
  if (action === 'LOGIN') return 'logged in'
  if (action === 'LOGOUT') return 'logged out'
  if (action === 'CREATE') return `created a new ${entityName}`
  if (action === 'UPDATE') return `updated a ${entityName}`
  if (action === 'DELETE') return `deleted a ${entityName}`
  if (action === 'CREATE_STUDENT') return `created a student account`
  if (action === 'CREATE_TEACHER') return `created a teacher account`
  if (action === 'CREATE_PARENT') return `created a parent account`
  return `${action.toLowerCase()} ${entityName}`
}

const formatTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString()
}

onMounted(async () => {
  try {
    const [statsRes, activityRes] = await Promise.all([
      api.get('/dashboard/admin'),
      api.get('/audit/recent')
    ])
    if (statsRes.data.success) stats.value = statsRes.data.data
    if (activityRes.data.success) activities.value = activityRes.data.data
  } catch { /* ignore */ }
})
</script>
